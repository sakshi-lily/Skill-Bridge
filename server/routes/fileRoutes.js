import express from 'express';
import { uploadTeamFile, getTeamFiles } from '../controllers/fileController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/teams/:teamId', upload.single('file'), uploadTeamFile);
router.get('/teams/:teamId', getTeamFiles);

export default router;
