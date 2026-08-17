const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getCurrentUsers = async (request, response) => {
  try {
      const users = await User.find();
  
      response.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    response.status(500).json({ success: false, message: "Server Error." });
  }
}

exports.register = async (request, response) => {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).json({ success: false, message: 'User already exists.' });
    }

    const existingName = await User.findOne({ name });
    if (existingName) {
      return response.status(400).json({ success: false, message: 'Username already taken.' });
    }

    const salt = await bcrypt.genSalt(10);
    
    const password_hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password_hash
    });

    // 6. Automatically log them in by generating a JWT
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // 201 means "Created successfully"
    response.status(201).json({ success: true, token });
    
  } catch (error) {
    console.error('Registration Error:', error);
    response.status(500).json({ success: false, message: 'Server error during registration.' });
  }
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