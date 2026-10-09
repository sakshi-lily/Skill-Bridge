import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

/**
 * Protect routes - verifies JWT in Authorization header
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource. Please provide a valid Bearer token.',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'skillbridge_secure_jwt_secret_key_2026'
    );

    // Fetch user from DB or standby session
    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists.',
        });
      }
    } else {
      user = {
        _id: decoded.id,
        id: decoded.id,
        role: decoded.role || 'student',
        name: decoded.name || 'Alex Morgan',
        email: decoded.email || 'alex.morgan@stanford.edu',
        university: 'Stanford University',
      };
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Token verification failed or token expired.',
    });
  }
};

/**
 * Authorize role access
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role || 'anonymous'}' is not authorized to access this route. Required: ${roles.join(', ')}.`,
      });
    }
    next();
  };
};
