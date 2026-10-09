import express from 'express';
import { getTeamMessages, postMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/teams/:teamId', getTeamMessages);
router.post('/teams/:teamId', postMessage);

export default router;
