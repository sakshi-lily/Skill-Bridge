import User from '../models/User.js';
import crypto from 'crypto';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Helper: send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  // Strip password hash from returned user object
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;
  delete userObj.resetPasswordToken;
  delete userObj.resetPasswordExpire;

  res.status(statusCode).json({
    success: true,
    token,
    user: userObj,
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = 'student',
      university,
      courseAndYear,
      major,
      skills,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    // Standby fallback if DB disconnected
    if (mongoose.connection.readyState !== 1) {
      const newUser = {
        _id: `user-${Date.now()}`,
        id: `user-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role: ['student', 'faculty', 'admin'].includes(role) ? role : 'student',
        university: university || 'Stanford University',
        courseAndYear: courseAndYear || 'Year 1',
        major: major || 'Computer Science',
        skills: Array.isArray(skills) ? skills : [],
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      };
      const token = jwt.sign(
        { id: newUser._id, role: newUser.role, name: newUser.name, email: newUser.email },
        process.env.JWT_SECRET || 'skillbridge_secure_jwt_secret_key_2026',
        { expiresIn: '30d' }
      );
      return res.status(201).json({
        success: true,
        token,
        user: newUser,
      });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: ['student', 'faculty', 'admin'].includes(role) ? role : 'student',
      university: university || 'Stanford University',
      courseAndYear: courseAndYear || 'Year 1',
      major: major || 'Computer Science',
      skills: Array.isArray(skills) ? skills : [],
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password.',
      });
    }

    // Standby fallback if DB disconnected
    if (mongoose.connection.readyState !== 1) {
      const lower = email.toLowerCase();
      const demoUsers = {
        'alex.morgan@stanford.edu': {
          _id: 'alex-morgan',
          id: 'alex-morgan',
          name: 'Alex Morgan',
          email: 'alex.morgan@stanford.edu',
          role: 'student',
          university: 'Stanford University',
          skills: ['React', 'Python', 'FastAPI', 'Tailwind CSS', 'PostgreSQL', 'UI/UX Design'],
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        },
        'sarah.patel@mit.edu': {
          _id: 'sarah-patel',
          id: 'sarah-patel',
          name: 'Sarah Patel',
          email: 'sarah.patel@mit.edu',
          role: 'student',
          university: 'MIT',
          skills: ['Figma', 'UI/UX Design', 'Tailwind CSS', 'React', 'User Research'],
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
        },
        'prof.davis@stanford.edu': {
          _id: 'prof-davis',
          id: 'prof-davis',
          name: 'Prof. Marcus Davis',
          email: 'prof.davis@stanford.edu',
          role: 'faculty',
          university: 'Stanford University',
          skills: ['Research Oversight', 'Capstone Mentorship', 'Distributed Systems'],
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
        },
        'admin@skillbridge.edu': {
          _id: 'admin-skillbridge',
          id: 'admin-skillbridge',
          name: 'Campus Administrator',
          email: 'admin@skillbridge.edu',
          role: 'admin',
          university: 'Stanford University',
          skills: ['Platform Moderation', 'Compliance'],
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
        },
      };

      const found = demoUsers[lower] || {
        _id: `user-${Date.now()}`,
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email: lower,
        role: 'student',
        university: 'Stanford University',
        skills: ['React', 'Tailwind CSS'],
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      };

      const token = jwt.sign(
        { id: found._id, role: found.role, name: found.name, email: found.email },
        process.env.JWT_SECRET || 'skillbridge_secure_jwt_secret_key_2026',
        { expiresIn: '30d' }
      );

      return res.status(200).json({
        success: true,
        token,
        user: found,
      });
    }

    // Find user by email including hidden password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    // Check password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password incorrect.',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        user: req.user,
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        user: { ...req.user, ...req.body },
      });
    }

    const fieldsToUpdate = {
      name: req.body.name,
      university: req.body.university,
      courseAndYear: req.body.courseAndYear,
      major: req.body.major,
      bio: req.body.bio,
      skills: req.body.skills,
      proficiency: req.body.proficiency,
      experienceLevel: req.body.experienceLevel,
      availability: req.body.availability,
      preferredRoles: req.body.preferredRoles,
      interests: req.body.interests,
      avatar: req.body.avatar,
      github: req.body.github,
      linkedin: req.body.linkedin,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot Password - generate single-use expiring token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address.',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        message: 'Password reset token generated successfully. Valid for 10 minutes.',
        resetToken: 'demo-reset-token-2026',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Security best practice: don't reveal whether user exists
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, password reset instructions have been generated.',
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // In local demo / development environment:
    const isDev = process.env.NODE_ENV !== 'production';

    res.status(200).json({
      success: true,
      message: 'Password reset token generated successfully. Valid for 10 minutes.',
      ...(isDev && { resetToken }), // Included in development for testing convenience
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset Password with token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both reset token and a new password.',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        message: 'Password successfully updated (standby mode).',
      });
    }

    // Hash token from request to compare with stored hash
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.',
      });
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully.',
  });
};
