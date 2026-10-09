import mongoose from 'mongoose';

const TeamMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'Team Lead',
  },
  avatar: {
    type: String,
    default: '',
  },
  university: {
    type: String,
    default: '',
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  isOwner: {
    type: Boolean,
    default: false,
  },
});

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a team name'],
      trim: true,
      maxlength: [100, 'Team name cannot exceed 100 characters'],
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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ownerName: {
      type: String,
      default: '',
    },
    maxMembers: {
      type: Number,
      default: 4,
      min: [2, 'Team must have at least 2 members capacity'],
      max: [10, 'Team size cannot exceed 10'],
    },
    members: {
      type: [TeamMemberSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['Active', 'Recruiting', 'Completed', 'Archived'],
      default: 'Active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index to quickly query user's memberships
TeamSchema.index({ 'members.user': 1 });

const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema);
export default Team;
