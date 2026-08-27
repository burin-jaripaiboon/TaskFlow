const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  ownerId: { 
    type: Schema.Types.ObjectId, // This is MongoDB's version of a UUID
    ref: 'User',                 // This tells Mongoose which collection this ID belongs to
    required: true 
  },
  isPublicAccess: {
    type: Boolean,
    required: true,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
