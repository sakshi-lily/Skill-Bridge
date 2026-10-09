import mongoose from 'mongoose';

const InvitationSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      index: true,
    },
    inviter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    invitee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    offeredRole: {
      type: String,
      default: 'Co-builder',
      trim: true,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate active pending invitations for the same user in the same team
InvitationSchema.index({ team: 1, invitee: 1, status: 1 });

const Invitation = mongoose.models.Invitation || mongoose.model('Invitation', InvitationSchema);
export default Invitation;
