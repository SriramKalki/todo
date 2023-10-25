const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date, 
    required: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: new Date(),
  },
  userId: {
    type: String,
    required: true
  }
},
{
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
