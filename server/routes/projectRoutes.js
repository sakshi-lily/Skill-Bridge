import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectMatches,
  applyToProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProjects);
router.post('/', protect, createProject);
router.get('/:id', getProjectById);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.get('/:id/matches', protect, getProjectMatches);
router.post('/:id/apply', protect, applyToProject);

export default router;
