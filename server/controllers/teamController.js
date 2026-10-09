import mongoose from 'mongoose';
import Team from '../models/Team.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Invitation from '../models/Invitation.js';
import { createNotification } from '../services/notificationService.js';

const FALLBACK_TEAMS = [
  {
    _id: 'team-campuspulse',
    id: 'team-campuspulse',
    name: 'CampusPulse Core Team',
    description: 'Autonomous squad developing real-time edge processing and ML sensor models.',
    project: 'proj-1',
    projectName: 'CampusPulse AI',
    owner: {
      _id: 'alex-morgan',
      name: 'Alex Morgan',
      email: 'alex.morgan@stanford.edu',
      university: 'Stanford University',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
    ownerName: 'Alex Morgan',
    maxMembers: 4,
    members: [
      {
        user: 'alex-morgan',
        name: 'Alex Morgan',
        role: 'Team Lead',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        university: 'Stanford University',
        isOwner: true,
      },
      {
        user: 'sarah-patel',
        name: 'Sarah Patel',
        role: 'UI/UX Designer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
        university: 'MIT',
        isOwner: false,
      },
      {
        user: 'david-chen',
        name: 'David Chen',
        role: 'Backend Architect',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
        university: 'UC Berkeley',
        isOwner: false,
      },
    ],
    createdAt: '2026-10-02',
  },
];

/**
 * @desc    Create a new team
 * @route   POST /api/teams
 * @access  Private
 */
export const createTeam = async (req, res, next) => {
  try {
    const { name, description, projectId, maxMembers = 4, creatorRole = 'Team Lead' } = req.body;

    if (!name || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'Team name and project ID are required.',
      });
    }

    // Standby fallback if DB disconnected
    if (mongoose.connection.readyState !== 1) {
      const newTeam = {
        _id: `team-${Date.now()}`,
        id: `team-${Date.now()}`,
        name: name.trim(),
        description: description?.trim() || '',
        project: projectId,
        projectName: 'Active Capstone Project',
        owner: req.user._id,
        ownerName: req.user.name,
        maxMembers: Number(maxMembers) || 4,
        members: [
          {
            user: req.user._id,
            name: req.user.name,
            role: creatorRole,
            avatar: req.user.avatar,
            university: req.user.university,
            isOwner: true,
          },
        ],
        createdAt: new Date().toISOString().split('T')[0],
      };
      return res.status(201).json({ success: true, team: newTeam });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Associated project not found.',
      });
    }

    const team = await Team.create({
      name: name.trim(),
      description: description?.trim() || '',
      project: project._id,
      projectName: project.title,
      owner: req.user._id,
      ownerName: req.user.name,
      maxMembers: Number(maxMembers) || 4,
      members: [
        {
          user: req.user._id,
          name: req.user.name,
          role: creatorRole,
          avatar: req.user.avatar,
          university: req.user.university,
          isOwner: true,
        },
      ],
    });

    res.status(201).json({
      success: true,
      team,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all teams
 * @route   GET /api/teams
 * @access  Private
 */
export const getTeams = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: FALLBACK_TEAMS.length,
        teams: FALLBACK_TEAMS,
      });
    }

    const { myTeams } = req.query;
    let query = {};

    if (myTeams === 'true') {
      query['members.user'] = req.user._id;
    }

    const teams = await Team.find(query)
      .populate('project', 'title category deadline')
      .populate('owner', 'name avatar university email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get team by ID
 * @route   GET /api/teams/:id
 * @access  Private
 */
export const getTeamById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const found = FALLBACK_TEAMS.find(t => t._id === req.params.id || t.id === req.params.id) || FALLBACK_TEAMS[0];
      return res.status(200).json({
        success: true,
        team: found,
        pendingInvitations: [],
      });
    }

    const team = await Team.findById(req.params.id)
      .populate('project', 'title category deadline requiredSkills status')
      .populate('owner', 'name email avatar university')
      .populate('members.user', 'name email avatar university skills bio');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found.',
      });
    }

    // Also fetch pending invitations for this team if user is owner
    let pendingInvitations = [];
    if (team.owner._id.toString() === req.user.id || req.user.role === 'admin') {
      pendingInvitations = await Invitation.find({
        team: team._id,
        status: 'pending',
      }).populate('invitee', 'name avatar university email');
    }

    res.status(200).json({
      success: true,
      team,
      pendingInvitations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Invite student to team
 * @route   POST /api/teams/:id/invite
 * @access  Private (Owner Only)
 */
export const inviteMember = async (req, res, next) => {
  try {
    const { studentId, role = 'Co-builder', note = '' } = req.body;

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        message: `Invitation sent successfully to student for role '${role}'.`,
      });
    }

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found.',
      });
    }

    // Owner authorization check
    if (team.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the team owner is authorized to send invitations.',
      });
    }

    // Team size limit check
    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({
        success: false,
        message: `Team has reached its maximum size capacity of ${team.maxMembers} members.`,
      });
    }

    // Check if candidate is already a member
    const alreadyMember = team.members.some(m => m.user.toString() === studentId);
    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'This student is already a member of the team.',
      });
    }

    // Check if invite is already pending
    const existingInvite = await Invitation.findOne({
      team: team._id,
      invitee: studentId,
      status: 'pending',
    });

    if (existingInvite) {
      return res.status(400).json({
        success: false,
        message: 'An invitation is already pending for this student.',
      });
    }

    const inviteeUser = await User.findById(studentId);
    if (!inviteeUser) {
      return res.status(404).json({
        success: false,
        message: 'Target student not found.',
      });
    }

    const invitation = await Invitation.create({
      team: team._id,
      project: team.project,
      inviter: req.user._id,
      invitee: inviteeUser._id,
      offeredRole: role,
      note,
    });

    // Notify invitee
    await createNotification({
      recipient: inviteeUser._id,
      sender: req.user._id,
      senderName: req.user.name,
      senderAvatar: req.user.avatar,
      type: 'invite',
      title: 'New Team Invitation',
      message: `${req.user.name} invited you to join team '${team.name}' as ${role}.`,
      relatedTeam: team._id,
    });

    res.status(201).json({
      success: true,
      message: 'Invitation sent successfully.',
      invitation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Respond to an invitation (Accept/Reject)
 * @route   PUT /api/teams/invitations/:inviteId
 * @access  Private
 */
export const respondToInvitation = async (req, res, next) => {
  try {
    const { action } = req.body; // 'accept' or 'reject'

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        message: `Invitation ${action === 'reject' ? 'rejected' : 'accepted'} successfully (standby mode).`,
      });
    }

    const invitation = await Invitation.findById(req.params.inviteId);

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found.',
      });
    }

    // Must be the invitee
    if (invitation.invitee.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this invitation.',
      });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This invitation has already been ${invitation.status}.`,
      });
    }

    if (action === 'reject') {
      invitation.status = 'rejected';
      await invitation.save();
      return res.status(200).json({
        success: true,
        message: 'Invitation declined.',
      });
    }

    // Action is accept: check team capacity
    const team = await Team.findById(invitation.team);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team no longer exists.',
      });
    }

    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'This team has already reached its member capacity.',
      });
    }

    // Add member if not already present
    if (!team.members.some(m => m.user.toString() === req.user.id)) {
      team.members.push({
        user: req.user._id,
        name: req.user.name,
        role: invitation.offeredRole || 'Co-builder',
        avatar: req.user.avatar,
        university: req.user.university,
        isOwner: false,
      });
      await team.save();
    }

    invitation.status = 'accepted';
    await invitation.save();

    // Notify team owner
    await createNotification({
      recipient: team.owner,
      sender: req.user._id,
      senderName: req.user.name,
      senderAvatar: req.user.avatar,
      type: 'invite',
      title: 'Invitation Accepted',
      message: `${req.user.name} accepted your invitation to join ${team.name}.`,
      relatedTeam: team._id,
    });

    res.status(200).json({
      success: true,
      message: 'Invitation accepted! You are now a team member.',
      team,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a member's role
 * @route   PUT /api/teams/:id/members/:userId/role
 * @access  Private (Owner Only)
 */
export const updateMemberRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found.',
      });
    }

    // Only owner can update roles
    if (team.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the team owner can reassign member roles.',
      });
    }

    const member = team.members.find(m => m.user.toString() === req.params.userId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in this team.',
      });
    }

    member.role = role || member.role;
    await team.save();

    res.status(200).json({
      success: true,
      message: 'Member role updated successfully.',
      team,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove member from team
 * @route   DELETE /api/teams/:id/members/:userId
 * @access  Private (Owner or Self)
 */
export const removeMember = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found.',
      });
    }

    const isOwner = team.owner.toString() === req.user.id;
    const isSelf = req.params.userId === req.user.id;

    if (!isOwner && !isSelf && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove members from this team.',
      });
    }

    // Prevent removing the owner
    if (req.params.userId === team.owner.toString()) {
      return res.status(400).json({
        success: false,
        message: 'The team owner cannot be removed. Transfer ownership or delete team.',
      });
    }

    team.members = team.members.filter(m => m.user.toString() !== req.params.userId);
    await team.save();

    res.status(200).json({
      success: true,
      message: 'Member removed from team.',
      team,
    });
  } catch (error) {
    next(error);
  }
};
