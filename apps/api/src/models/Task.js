const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['TODO', 'IN_PROGRESS', 'DONE'], // Restricts the allowed values
    default: 'TODO' 
  },
  projectId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  assignedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  assignedTo: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    default: null // Optional assignment
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);