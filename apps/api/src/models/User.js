const mongoose = require('mongoose');
const { Schema } = mongoose;

const activeDeviceSchema = new Schema({
  sessionId: { type: String, required: true },
  token_hash: { type: String, required: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

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
  },
  activeSessions: [activeDeviceSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
