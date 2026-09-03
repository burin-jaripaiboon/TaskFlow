const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authService = require('../services/authService');

exports.register = async (request, response) => {
    const userData = request.body;
    const token = authService.generateToken(await authService.createUser(userData));
    response.status(201).json({ success: true, token });
};

exports.login = async (request, response) => {
  try {
    const { identifier, password } = request.body;

    if (!identifier || !password) {
      return response.status(400).json({ success: false, message: "Please provide an email/username and password" });
    }
    
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { name: identifier.toLowerCase() }
      ]
    });
    
    if (!user) {
      return response.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return response.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const payload = { userId: user._id };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    response.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.refreshToken = async (request, response) => {
}
