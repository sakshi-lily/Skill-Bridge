import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a skill name'],
      unique: true,
      trim: true,
      maxlength: [60, 'Skill name cannot exceed 60 characters'],
      index: true,
    },
    category: {
      type: String,
      enum: [
        'Frontend',
        'Backend',
        'Full-Stack',
        'Mobile',
        'AI & Machine Learning',
        'Data Science',
        'DevOps & Cloud',
        'Design & UI/UX',
        'Cybersecurity',
        'Blockchain',
        'Soft Skills',
        'Other',
      ],
      default: 'Other',
      index: true,
    },
    aliases: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    popular: {
      type: Boolean,
      default: false,
      index: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

SkillSchema.index({ name: 'text', aliases: 'text', category: 'text' });

const Skill = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
export default Skill;
