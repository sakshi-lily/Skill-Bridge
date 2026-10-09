import mongoose from 'mongoose';

const AttachmentSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, default: 'application/octet-stream' },
  fileSize: { type: Number, default: 0 },
});

const MessageSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderAvatar: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
      default: '',
    },
    attachments: {
      type: [AttachmentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ team: 1, createdAt: -1 });

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
export default Message;
