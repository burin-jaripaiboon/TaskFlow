const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../utilities/AppError');

const MAX_DEVICES = 5;
const DEVICE_TOKEN_EXPIRED_ERROR_CODE = 'DEVICE_TOKEN_EXPIRED';

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

const generateDeviceToken = (devicePayload) => {
  return jwt.sign(devicePayload, process.env.JWT_DEVICE_SECRET, { expiresIn: '7d' });
}

const generateAccessToken = (accessPayload) => {
  return jwt.sign(accessPayload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
}

const registerDevice = async (user) => {
  const userId = user._id;
  const deviceId = crypto.randomUUID();
  const deviceToken = generateDeviceToken({ userId, deviceId });
  const accessToken = generateAccessToken({ userId });

  const { exp } = jwt.decode(deviceToken);
  const expiresAt = new Date(exp * 1000);

  // Purge expired devices
  user.activeDevices = user.activeDevices.filter(
    device => device.expiresAt > new Date()
  );

  // Kick out oldest device if more than 5 devices logged in to the account
  if (user.activeDevices.length >= MAX_DEVICES) {
    user.activeDevices.sort((a, b) => a.expiresAt - b.expiresAt);
    user.activeDevices.shift(); 
  }
  const salt = await bcrypt.genSalt(10);
  const token_hash = await bcrypt.hash(deviceToken, salt);
  user.activeDevices.push({
    deviceId,
    token_hash,
    expiresAt
  })
  await user.save();
  return { deviceToken, accessToken, expiresAt };
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

const logoutUser = async (deviceToken) => {
  try {
    const { userId, deviceId } = jwt.verify(deviceToken, process.env.JWT_DEVICE_SECRET, {
      ignoreExpiration: true
    });
    await User.findByIdAndUpdate(userId, { $pull: { activeDevices: { deviceId } } });
  } catch (error) {
    console.error('Logout attempted with invalid token signature.');
  }
}

const renewTokens = async (oldDeviceToken) => {
  if (!oldDeviceToken) throw new AppError('No Session token provided!', 401);
   
  let payload;
  try {
    payload = jwt.verify(oldDeviceToken, process.env.JWT_DEVICE_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const deviceExpiredError = new AppError('Session expired. Please login and try again.', 401);
      deviceExpiredError.errorCode = DEVICE_TOKEN_EXPIRED_ERROR_CODE;
      throw deviceExpiredError;
    }
    throw new AppError(`Invalid session signature: ${error.message}`, 401);
  }

  const { userId, deviceId } = payload;
  const user = await User.findById(userId);


  if (!user) throw new AppError('User no longer exists', 404);

  const deviceSession = user.activeDevices.find(device => device.deviceId === deviceId);

  // Device removed
  if (!deviceSession) {
    const revokedError = new AppError('Session revoked. Please log in again.', 401);
    revokedError.errorCode = DEVICE_TOKEN_EXPIRED_ERROR_CODE;
    throw revokedError;
  }

  const isMatch = await bcrypt.compare(oldDeviceToken, deviceSession.token_hash);

  // Device token Reused
  if (!isMatch) {
    // Remove device
    user.activeDevices = user.activeDevices.filter(device => device.deviceId !== deviceId);
    await user.save();
    
    const breachError = new AppError('Security Alert: Session compromised. You have been logged out of this device.', 401);
    breachError.errorCode = DEVICE_TOKEN_EXPIRED_ERROR_CODE;
    throw breachError;
  }

  // Valid device token
  const newDeviceToken = generateDeviceToken({ userId, deviceId });
  const newAccessToken = generateAccessToken({ userId });
  
  const { exp } = jwt.decode(newDeviceToken);
  const expiresAt = new Date(exp * 1000);

  const salt = await bcrypt.genSalt(10);
  const new_token_hash = await bcrypt.hash(newDeviceToken, salt);

  deviceSession.token_hash = new_token_hash;
  deviceSession.expiresAt = expiresAt;
  await user.save();

  return { deviceToken: newDeviceToken, accessToken: newAccessToken, expiresAt };
}


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  renewTokens
};
