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
    enum: ['TODO', 'IN_PROGRESS', 'DONE'],
    default: 'TODO' 
  },
  priority: {
    type: Number,
    required: true,
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  },
  projectId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  assignedTo: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    default: null
  }
}, { timestamps: true });

taskSchema.index({ projectId: 1 });

module.exports = mongoose.model('Task', taskSchema);
