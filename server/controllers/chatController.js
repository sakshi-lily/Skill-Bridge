import Message from '../models/Message.js';
import Team from '../models/Team.js';

let ioInstance = null;
export const setChatIO = (io) => {
  ioInstance = io;
};

/**
 * @desc    Get message history for a team
 * @route   GET /api/chat/teams/:teamId
 * @access  Private
 */
export const getTeamMessages = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found.',
      });
    }

    // Membership check: must be a team member or admin
    const isMember = team.members.some(m => m.user.toString() === req.user.id);
    if (!isMember && req.user.role !== 'admin' && req.user.role !== 'faculty') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized. You are not a member of this team chat.',
      });
    }

    const messages = await Message.find({ team: team._id })
      .sort({ createdAt: 1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Send a message in team chat
 * @route   POST /api/chat/teams/:teamId
 * @access  Private
 */
export const postMessage = async (req, res, next) => {
  try {
    const { content, attachments } = req.body;
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found.',
      });
    }

    // Verify membership
    const isMember = team.members.some(m => m.user.toString() === req.user.id);
    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You cannot send messages to teams you do not belong to.',
      });
    }

    if (!content?.trim() && (!attachments || attachments.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty.',
      });
    }

    const message = await Message.create({
      team: team._id,
      sender: req.user._id,
      senderName: req.user.name,
      senderAvatar: req.user.avatar,
      content: content?.trim() || '',
      attachments: Array.isArray(attachments) ? attachments : [],
    });

    // Real-time broadcast to room
    if (ioInstance) {
      ioInstance.to(`team_${team._id}`).emit('team_message', message);
    }

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};
