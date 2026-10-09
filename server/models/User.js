import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Prevents password hash from being returned in queries
    },
    university: {
      type: String,
      trim: true,
      default: 'Stanford University',
    },
    academicYear: {
      type: String,
      trim: true,
      default: 'Year 3',
    },
    major: {
      type: String,
      trim: true,
      default: 'Computer Science',
    },
    courseAndYear: {
      type: String,
      trim: true,
      default: 'CS Junior • Year 3',
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    proficiency: {
      type: Map,
      of: String,
      default: {},
    },
    experienceLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    availability: {
      type: String,
      default: '10-15 hrs/week',
    },
    preferredRoles: {
      type: [String],
      default: ['Full-Stack Developer'],
    },
    interests: {
      type: [String],
      default: [],
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
    github: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
      default: 'student',
      index: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password using bcrypt before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare user-entered password with database hash
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'skillbridge_secure_jwt_secret_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expiration to 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
