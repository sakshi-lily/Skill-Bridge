import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Please provide a short description'],
      trim: true,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    detailedDescription: {
      type: String,
      trim: true,
      default: '',
    },
    problemStatement: {
      type: String,
      trim: true,
      default: '',
    },
    objectives: {
      type: [String],
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    requiredSkills: {
      type: [String],
      required: [true, 'Please specify required skills'],
      index: true,
    },
    category: {
      type: String,
      enum: [
        'Web Development',
        'Mobile Apps',
        'AI & Machine Learning',
        'Data Science',
        'Blockchain & Web3',
        'IoT & Embedded',
        'Design & UX',
        'Hackathon Project',
        'Capstone Project',
        'Startup MVP',
        'Other',
      ],
      default: 'Web Development',
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    teamSize: {
      type: Number,
      default: 4,
      min: [2, 'Team size must be at least 2'],
      max: [10, 'Team size cannot exceed 10'],
    },
    openPositionsCount: {
      type: Number,
      default: 3,
      min: [0, 'Open positions cannot be negative'],
    },
    availableRoles: {
      type: [String],
      default: ['Frontend Developer', 'Backend Developer', 'UI/UX Designer'],
    },
    mode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-campus'],
      default: 'Remote',
    },
    weeklyCommitment: {
      type: String,
      default: '6-8 hrs/week',
    },
    deadline: {
      type: String,
      default: 'Nov 30, 2026',
    },
    status: {
      type: String,
      enum: ['Recruiting', 'Active', 'In Progress', 'Completed', 'Archived'],
      default: 'Recruiting',
      index: true,
    },
    milestones: [
      {
        title: { type: String, required: true },
        targetDate: { type: String, default: '' },
        completed: { type: Boolean, default: false },
      },
    ],
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
        role: String,
        avatar: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Text index for search functionality
ProjectSchema.index({
  title: 'text',
  shortDescription: 'text',
  detailedDescription: 'text',
  requiredSkills: 'text',
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export default Project;
