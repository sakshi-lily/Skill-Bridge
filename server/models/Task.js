import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [150, 'Task title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    projectName: {
      type: String,
      default: '',
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
      index: true,
    },
    teamName: {
      type: String,
      default: '',
    },
    assignedTo: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      name: {
        type: String,
        default: 'Unassigned',
      },
      avatar: {
        type: String,
        default: '',
      },
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['To Do', 'In Progress', 'Review', 'Completed'],
      default: 'To Do',
      index: true,
    },
    dueDate: {
      type: String,
      required: [true, 'Please provide a due date'],
      index: true,
    },
    isOverdue: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Helper method / hook to calculate isOverdue
TaskSchema.pre('save', function (next) {
  if (this.dueDate && this.status !== 'Completed') {
    const today = new Date().toISOString().split('T')[0];
    this.isOverdue = this.dueDate < today;
  } else {
    this.isOverdue = false;
  }
  next();
});

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);
export default Task;
