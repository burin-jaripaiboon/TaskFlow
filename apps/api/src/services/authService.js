const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../utilities/AppError');

const MAX_SESSIONS = 5;
const DEVICE_TOKEN_EXPIRED_ERROR_CODE = 'REFRESH_TOKEN_EXPIRED';
const NO_DEVICE_TOKEN_ERROR_CODE = 'NO_REFRESH_TOKEN';

const createUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new AppError('Please provide all required fields.', 400);
  }

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    throw new AppError('This email is already registered', 400);
  }

  const existingName = await User.findOne({ name: name });
  if (existingName) {
    throw new AppError('Username is already taken', 400);
  }
  
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, password_hash });
  return user;
}

const generateRefreshToken = (sessionPayload) => {
  return jwt.sign(sessionPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

const generateAccessToken = (accessPayload) => {
  return jwt.sign(accessPayload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
}

const registerDevice = async (user) => {
  const userId = user._id;
  const sessionId = crypto.randomUUID();
  const refreshToken = generateRefreshToken({ userId, sessionId });
  const accessToken = generateAccessToken({ userId });

  const { exp } = jwt.decode(refreshToken);
  const expiresAt = new Date(exp * 1000);

  // Purge expired sessions
  user.activeSessions = user.activeSessions.filter(
    session => session.expiresAt > new Date()
  );

  // Kick out oldest session if more than 5 sessions logged in to the account
  if (user.activeSessions.length >= MAX_SESSIONS) {
    user.activeSessions.sort((a, b) => a.expiresAt - b.expiresAt);
    user.activeSessions.shift(); 
  }
  const salt = await bcrypt.genSalt(10);
  const token_hash = await bcrypt.hash(refreshToken, salt);
  user.activeSessions.push({
    sessionId,
    token_hash,
    expiresAt
  })
  await user.save();
  return { refreshToken, accessToken, expiresAt };
}

const registerUser = async ({ name, email, password }) => {
  const user = await createUser({ name, email, password });
  
  return await registerDevice(user);
}

const loginUser = async ({ identifier, password }) => {
  if (!identifier || !password) {
    throw new AppError('Please provide an email/username and password.', 400);
  }

  const user = await User.findOne({
    $or: [
      { email: identifier },
      { name: identifier.toLowerCase() }
    ]
  });
      
  if (!user) {
    throw new AppError('Invalid credentials.', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new AppError('Invalid credentials.', 401);
  }

  return await registerDevice(user);
}

const logoutUser = async (refreshToken) => {
  try {
    const { userId, sessionId } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, {
      ignoreExpiration: true
    });
    await User.findByIdAndUpdate(userId, { $pull: { activeSessions: { sessionId } } });
  } catch (error) {
    console.error('Logout attempted with invalid token signature.');
  }
}

const refreshTokens = async (oldRefreshToken) => {
  if (!oldRefreshToken) {
    const noDeviceError = new AppError('No Session token provided!', 401);
    noDeviceError.errorCode = NO_DEVICE_TOKEN_ERROR_CODE;
    throw noDeviceError;
  }
  let payload;
  try {
    payload = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      await logoutUser(oldRefreshToken);
      const sessionExpiredError = new AppError('Session expired. Please login and try again.', 401);
      sessionExpiredError.errorCode = DEVICE_TOKEN_EXPIRED_ERROR_CODE;
      throw sessionExpiredError;
    }
    throw new AppError(`Invalid session signature: ${error.message}`, 401);
  }
  const { userId, sessionId } = payload;
  const user = await User.findById(userId);


  if (!user) throw new AppError('User no longer / never exists', 404);

  const session = user.activeSessions.find(session => session.sessionId === sessionId);

  // Session removed
  if (!session) {
    const revokedError = new AppError('Session revoked / doesn\'t exist. Please log in again.', 401);
    revokedError.errorCode = DEVICE_TOKEN_EXPIRED_ERROR_CODE;
    throw revokedError;
  }

  const isMatch = await bcrypt.compare(oldRefreshToken, session.token_hash);

  // Device token Reused
  if (!isMatch) {
    // Remove refresh token
    logoutUser(oldRefreshToken);
    
    const breachError = new AppError('Security Alert: Session compromised. You have been logged out of this device.', 401);
    breachError.errorCode = DEVICE_TOKEN_EXPIRED_ERROR_CODE;
    throw breachError;
  }

  // Valid refresh token
  const newRefreshToken = generateRefreshToken({ userId, sessionId });
  const newAccessToken = generateAccessToken({ userId });
  
  const { exp } = jwt.decode(newRefreshToken);
  const expiresAt = new Date(exp * 1000);

  const salt = await bcrypt.genSalt(10);
  const new_token_hash = await bcrypt.hash(newRefreshToken, salt);

  session.token_hash = new_token_hash;
  session.expiresAt = expiresAt;
  await user.save();

  return { refreshToken: newRefreshToken, accessToken: newAccessToken, expiresAt };
}


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokens
};
