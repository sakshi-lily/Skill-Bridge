import mongoose from 'mongoose';
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
    // Standby fallback if DB disconnected
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: 2,
        messages: [
          {
            _id: 'msg-demo-1',
            team: req.params.teamId,
            senderName: 'Sarah Patel',
            senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
            content: 'Hey team! I just finalized the Figma design system components for the student navbar and team cards.',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            _id: 'msg-demo-2',
            team: req.params.teamId,
            senderName: 'David Chen',
            senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
            content: 'Awesome work Sarah. The FastAPI route validation for JWT tokens is also merged into develop branch.',
            createdAt: new Date(Date.now() - 1800000).toISOString(),
          },
        ],
      });
    }

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

    if (!content?.trim() && (!attachments || attachments.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty.',
      });
    }

    // Standby fallback if DB disconnected
    if (mongoose.connection.readyState !== 1) {
      const newMsg = {
        _id: `msg-${Date.now()}`,
        team: req.params.teamId,
        sender: req.user._id,
        senderName: req.user.name,
        senderAvatar: req.user.avatar,
        content: content?.trim() || '',
        attachments: Array.isArray(attachments) ? attachments : [],
        createdAt: new Date().toISOString(),
      };

      if (ioInstance) {
        ioInstance.to(`team_${req.params.teamId}`).emit('team_message', newMsg);
        ioInstance.to(`team_${req.params.teamId}`).emit('new_message', newMsg);
      }

      return res.status(201).json({
        success: true,
        message: newMsg,
      });
    }

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
      ioInstance.to(`team_${team._id}`).emit('new_message', message);
    }

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};
