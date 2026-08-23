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
    unique: true
  },
  password_hash: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);