import express from 'express';
import { getFacultyDashboardData } from '../controllers/facultyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected for faculty and admin roles only
router.use(protect);
router.use(authorize('faculty', 'admin'));

router.get('/dashboard', getFacultyDashboardData);

export default router;
