import mongoose from 'mongoose';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import { rankStudentsForProject } from '../utils/skillMatching.js';
import { createNotification } from '../services/notificationService.js';

// ==========================================
// COMMON HELPERS
// ==========================================

const isDatabaseConnected = () =>
  mongoose.connection.readyState === 1;

const databaseUnavailable = (res) =>
  res.status(503).json({
    success: false,
    message: 'Database unavailable. Please try again later.',
  });

const isValidId = (id) => mongoose.isValidObjectId(id);

const getUserId = (req) =>
  String(req.user?._id || req.user?.id || '');

const isOwnerOrAdmin = (project, req) =>
  String(project.owner) === getUserId(req) ||
  req.user?.role === 'admin';

const allowedProjectFields = [
  'title',
  'shortDescription',
  'detailedDescription',
  'problemStatement',
  'objectives',
  'requiredSkills',
  'category',
  'difficulty',
  'teamSize',
  'openPositionsCount',
  'availableRoles',
  'mode',
  'weeklyCommitment',
  'deadline',
  'milestones',
];

const sanitizeProjectData = (body = {}) => {
  const data = {};

  for (const field of allowedProjectFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      data[field] = body[field];
    }
  }

  return data;
};

const validateProjectData = (data) => {
  if (
    typeof data.title !== 'string' ||
    data.title.trim().length < 5
  ) {
    return 'Project title must contain at least 5 characters.';
  }

  if (
    typeof data.shortDescription !== 'string' ||
    data.shortDescription.trim().length < 20
  ) {
    return 'Short description must contain at least 20 characters.';
  }

  if (
    !Array.isArray(data.requiredSkills) ||
    data.requiredSkills.length === 0 ||
    !data.requiredSkills.every(
      (skill) => typeof skill === 'string' && skill.trim()
    )
  ) {
    return 'Please provide at least one valid required skill.';
  }

  if (
    data.teamSize !== undefined &&
    (!Number.isInteger(Number(data.teamSize)) ||
      Number(data.teamSize) < 1)
  ) {
    return 'Team size must be a positive integer.';
  }

  return null;
};

// ==========================================
// 1. GET ALL PROJECTS
// GET /api/projects
// ==========================================

export const getProjects = async (req, res, next) => {
  try {
    if (!isDatabaseConnected()) {
      return databaseUnavailable(res);
    }

    const {
      search,
      category,
      difficulty,
      mode,
      status,
      sort,
    } = req.query;

    const query = {};

    if (typeof search === 'string' && search.trim()) {
      const safeSearch = search.trim().replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

      query.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { shortDescription: { $regex: safeSearch, $options: 'i' } },
        { requiredSkills: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    if (category && !['All', 'All Categories'].includes(category)) {
      query.category = category;
    }

    if (difficulty && !['All', 'All Levels'].includes(difficulty)) {
      query.difficulty = difficulty;
    }

    if (mode && !['All', 'All Formats'].includes(mode)) {
      query.mode = mode;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    let sortOption = { createdAt: -1 };

    if (sort === 'deadline') {
      sortOption = { deadline: 1 };
    } else if (sort === 'teamSize') {
      sortOption = { teamSize: -1 };
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar university')
      .sort(sortOption);

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 2. GET SINGLE PROJECT
// GET /api/projects/:id
// ==========================================

export const getProjectById = async (req, res, next) => {
  try {
    if (!isDatabaseConnected()) {
      return databaseUnavailable(res);
    }

    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID.',
      });
    }

    const project = await Project.findById(req.params.id)
      .populate(
        'owner',
        'name email avatar university bio major academicYear'
      )
      .populate(
        'members.user',
        'name email avatar university skills'
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. CREATE PROJECT
// POST /api/projects
// ==========================================

export const createProject = async (req, res, next) => {
  try {
    if (!isDatabaseConnected()) {
      return databaseUnavailable(res);
    }

    const data = sanitizeProjectData(req.body);

    const validationError = validateProjectData(data);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const teamSize = Number(data.teamSize) || 4;

    const project = await Project.create({
      ...data,
      title: data.title.trim(),
      shortDescription: data.shortDescription.trim(),
      detailedDescription:
        data.detailedDescription || data.shortDescription,
      problemStatement: data.problemStatement || '',
      objectives: Array.isArray(data.objectives)
        ? data.objectives
        : [],
      requiredSkills: data.requiredSkills.map((skill) =>
        skill.trim()
      ),
      category: data.category || 'Web Development',
      difficulty: data.difficulty || 'Intermediate',
      mode: data.mode || 'Remote',
      teamSize,
      openPositionsCount:
        data.openPositionsCount !== undefined
          ? Number(data.openPositionsCount)
          : Math.max(teamSize - 1, 0),
      availableRoles: Array.isArray(data.availableRoles)
        ? data.availableRoles
        : ['Frontend Developer'],
      weeklyCommitment:
        data.weeklyCommitment || '6-8 hrs/week',
      deadline: data.deadline || 'Nov 30, 2026',
      milestones: Array.isArray(data.milestones)
        ? data.milestones
        : [],
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          name: req.user.name,
          role: 'Project Lead',
          avatar: req.user.avatar,
        },
      ],
    });

    const populated = await Project.findById(project._id)
      .populate('owner', 'name email avatar university');

    return res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      project: populated,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 4. UPDATE PROJECT
// PUT /api/projects/:id
// ==========================================

export const updateProject = async (req, res, next) => {
  try {
    if (!isDatabaseConnected()) {
      return databaseUnavailable(res);
    }

    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID.',
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    if (!isOwnerOrAdmin(project, req)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project.',
      });
    }

    const updates = sanitizeProjectData(req.body);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid project fields provided.',
      });
    }

    if (
      updates.title !== undefined &&
      (typeof updates.title !== 'string' ||
        updates.title.trim().length < 5)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Project title must contain at least 5 characters.',
      });
    }

    if (
      updates.requiredSkills !== undefined &&
      (!Array.isArray(updates.requiredSkills) ||
        updates.requiredSkills.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Required skills must be a non-empty array.',
      });
    }

    if (
      updates.teamSize !== undefined &&
      (!Number.isInteger(Number(updates.teamSize)) ||
        Number(updates.teamSize) < 1)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team size.',
      });
    }

    if (updates.teamSize !== undefined) {
      updates.teamSize = Number(updates.teamSize);
    }

    if (updates.openPositionsCount !== undefined) {
      updates.openPositionsCount = Number(
        updates.openPositionsCount
      );
    }

    Object.assign(project, updates);

    await project.save();

    await project.populate(
      'owner',
      'name email avatar university'
    );

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 5. DELETE PROJECT
// DELETE /api/projects/:id
// ==========================================

export const deleteProject = async (req, res, next) => {
  try {
    if (!isDatabaseConnected()) {
      return databaseUnavailable(res);
    }

    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID.',
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    if (!isOwnerOrAdmin(project, req)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project.',
      });
    }

    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 6. SKILL-BASED MATCHING
// GET /api/projects/:id/matches
// ==========================================

export const getProjectMatches = async (req, res, next) => {
  try {
    if (!isDatabaseConnected()) {
      return databaseUnavailable(res);
    }

    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID.',
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    const candidates = await User.find({
      role: 'student',
      _id: { $ne: req.user._id },
    }).select('-password');

    const rankedMatches = rankStudentsForProject(
      project.requiredSkills,
      candidates
    );

    return res.status(200).json({
      success: true,
      projectId: project._id,
      projectTitle: project.title,
      requiredSkills: project.requiredSkills,
      count: rankedMatches.length,
      matches: rankedMatches,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 7. APPLY TO PROJECT
// POST /api/projects/:id/apply
// ==========================================

export const applyToProject = async (req, res, next) => {
  try {
    if (!isDatabaseConnected()) {
      return databaseUnavailable(res);
    }

    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID.',
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    if (String(project.owner) === getUserId(req)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot apply to your own project.',
      });
    }

    const existing = await Application.findOne({
      project: project._id,
      applicant: req.user._id,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          `You have already applied. Status: ${existing.status}`,
      });
    }

    const application = await Application.create({
      project: project._id,
      applicant: req.user._id,
      roleApplied:
        req.body.roleApplied ||
        req.body.role ||
        'Collaborator',
      message:
        req.body.message ||
        req.body.note ||
        '',
    });

    // Notification failure should not undo a saved application.
    try {
      await createNotification({
        recipient: project.owner,
        sender: req.user._id,
        senderName: req.user.name,
        senderAvatar: req.user.avatar,
        type: 'application',
        title: 'New Project Application',
        message:
          `${req.user.name} applied for role ` +
          `'${application.roleApplied}' on ${project.title}.`,
        relatedProject: project._id,
      });
    } catch (notificationError) {
      console.error(
        'Application notification failed:',
        notificationError.message
      );
    }

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      application,
    });
  } catch (error) {
    next(error);
  }
};
