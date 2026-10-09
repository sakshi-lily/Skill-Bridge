import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  logout,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.post('/reset-password', passwordResetLimiter, resetPassword);

export default router;
