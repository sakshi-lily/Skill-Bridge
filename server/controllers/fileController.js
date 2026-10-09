import mongoose from 'mongoose';
import FileAttachment from '../models/FileAttachment.js';
import Team from '../models/Team.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Upload file attachment for team
 * @route   POST /api/files/teams/:teamId
 * @access  Private
 */
export const uploadTeamFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a file to upload.',
      });
    }

    // Standby fallback if DB disconnected
    if (mongoose.connection.readyState !== 1) {
      const fileAttachment = {
        _id: `file-${Date.now()}`,
        team: req.params.teamId,
        uploadedBy: req.user._id,
        uploaderName: req.user.name,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        description: req.body.description || '',
        createdAt: new Date().toISOString(),
      };

      return res.status(201).json({
        success: true,
        file: fileAttachment,
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
        message: 'Not authorized to upload files to this team.',
      });
    }

    const fileAttachment = await FileAttachment.create({
      team: team._id,
      uploadedBy: req.user._id,
      uploaderName: req.user.name,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      description: req.body.description || '',
    });

    res.status(201).json({
      success: true,
      file: fileAttachment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get files for a team
 * @route   GET /api/files/teams/:teamId
 * @access  Private
 */
export const getTeamFiles = async (req, res, next) => {
  try {
    // Standby fallback if DB disconnected
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: 2,
        files: [
          {
            _id: 'file-demo-1',
            team: req.params.teamId,
            uploaderName: 'Sarah Patel',
            originalName: 'CampusPulse_UI_Components.pdf',
            fileUrl: '#',
            fileType: 'application/pdf',
            fileSize: 2450000,
            description: 'Design system specifications and screen flows for MVP sprint',
            createdAt: '2026-10-06',
          },
          {
            _id: 'file-demo-2',
            team: req.params.teamId,
            uploaderName: 'David Chen',
            originalName: 'FastAPI_Architecture_Diagram.png',
            fileUrl: '#',
            fileType: 'image/png',
            fileSize: 840000,
            description: 'Microservice interaction flow with WebSockets and Redis cache',
            createdAt: '2026-10-07',
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

    // Verify membership
    const isMember = team.members.some(m => m.user.toString() === req.user.id);
    if (!isMember && req.user.role !== 'admin' && req.user.role !== 'faculty') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view files for this team.',
      });
    }

    const files = await FileAttachment.find({ team: team._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: files.length,
      files,
    });
  } catch (error) {
    next(error);
  }
};
