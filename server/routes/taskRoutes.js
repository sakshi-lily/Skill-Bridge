import express from 'express';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskStats,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All task endpoints require authentication

router.post('/', createTask);
router.get('/', getTasks);
router.get('/stats', getTaskStats);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
