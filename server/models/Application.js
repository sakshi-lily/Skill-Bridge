import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    roleApplied: {
      type: String,
      default: 'Collaborator',
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate active applications from the same user to the same project
ApplicationSchema.index({ project: 1, applicant: 1 }, { unique: true });

const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
export default Application;
