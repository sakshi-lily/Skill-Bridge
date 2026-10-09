import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    senderName: {
      type: String,
      default: 'SkillBridge System',
    },
    senderAvatar: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['invite', 'application', 'task', 'milestone', 'system', 'message'],
      default: 'system',
      index: true,
    },
    title: {
      type: String,
      default: 'Notification',
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    relatedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    relatedTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    relatedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
export default Notification;
