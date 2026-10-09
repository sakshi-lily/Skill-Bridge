import express from 'express';
import {
  createTeam,
  getTeams,
  getTeamById,
  inviteMember,
  respondToInvitation,
  updateMemberRole,
  removeMember,
} from '../controllers/teamController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All team endpoints require authentication

router.post('/', createTeam);
router.get('/', getTeams);
router.get('/:id', getTeamById);
router.post('/:id/invite', inviteMember);
router.put('/invitations/:inviteId', respondToInvitation);
router.put('/:id/members/:userId/role', updateMemberRole);
router.delete('/:id/members/:userId', removeMember);

export default router;
