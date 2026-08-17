const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    match: [
      /^[a-z0-9_]+$/, 
      'Name can only contain lowercase letters, numbers, and underscores'
    ]
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // Ensures no two users have the same email
  },
  password_hash: { 
    type: String, 
    required: true 
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model('User', userSchema);