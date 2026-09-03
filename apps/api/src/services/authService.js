const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../utilities/AppError');

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

const generateToken = (userId) => {
  const payload = { userId };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
}

const registerUser = async (userData) => {
  const { _id: userId } = await createUser(userData);
  const token = generateToken(userId);
  return token;
}

module.exports = {
  createUser,
  generateToken,
  registerUser
};
