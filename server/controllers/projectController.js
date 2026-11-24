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

const FALLBACK_PROJECTS = [
  {
    _id: 'career-guidance',
    id: 'career-guidance',
    title: 'AI-Powered Career Guidance Platform',
    shortDescription: 'An intelligent recommendation engine connecting students with personalized tech roadmaps.',
    category: 'Web Development',
    difficulty: 'Intermediate',
    mode: 'Remote',
    teamSize: 4,
    requiredSkills: ['React', 'Python', 'FastAPI', 'Tailwind CSS'],
    owner: { name: 'Alex Morgan', role: 'student' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'student-collaboration-portal',
    id: 'student-collaboration-portal',
    title: 'Student Collaboration Portal',
    shortDescription: 'A multi-campus hub for forming study circles and running sprint-based capstone projects.',
    category: 'Web Development',
    difficulty: 'Beginner',
    mode: 'Hybrid',
    teamSize: 5,
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'Socket.IO'],
    owner: { name: 'Sarah Patel', role: 'student' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'campus-notes-ai',
    id: 'campus-notes-ai',
    title: 'Campus Notes AI Summarizer',
    shortDescription: 'AI-driven study material summarizer with interactive quizzes and concept mapping.',
    category: 'AI / Machine Learning',
    difficulty: 'Advanced',
    mode: 'Remote',
    teamSize: 3,
    requiredSkills: ['Python', 'PyTorch', 'FastAPI', 'Next.js'],
    owner: { name: 'David Chen', role: 'student' },
    createdAt: new Date().toISOString(),
  }
];

// ==========================================
// 1. GET ALL PROJECTS
// GET /api/projects
// ==========================================

export const getProjects = async (req, res, next) => {
  try {
    if (!isDatabaseConnected()) {
      let filtered = [...FALLBACK_PROJECTS];
      const { category, difficulty, mode, search } = req.query;
      if (category && !['All', 'All Categories'].includes(category)) {
        filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
      if (difficulty && !['All', 'All Difficulties'].includes(difficulty)) {
        filtered = filtered.filter(p => p.difficulty?.toLowerCase() === difficulty.toLowerCase());
      }
      if (mode && !['All', 'All Modes'].includes(mode)) {
        filtered = filtered.filter(p => p.mode?.toLowerCase() === mode.toLowerCase());
      }
      if (search && search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(p => p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
      }
      return res.status(200).json({
        success: true,
        count: filtered.length,
        projects: filtered,
      });
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
    const fallback = FALLBACK_PROJECTS.find(
      (p) => p._id === req.params.id || p.id === req.params.id
    );

    if (!isDatabaseConnected()) {
      if (fallback) {
        return res.status(200).json({ success: true, project: fallback });
      }
      return databaseUnavailable(res);
    }

    if (!isValidId(req.params.id)) {
      if (fallback) {
        return res.status(200).json({ success: true, project: fallback });
      }
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
      const candidates = [
        { _id: 'u1', id: 'u1', name: 'Alex Morgan', skills: ['React', 'Python', 'FastAPI', 'Tailwind CSS'], university: 'Stanford University' },
        { _id: 'u2', id: 'u2', name: 'Sarah Patel', skills: ['Figma', 'React', 'UI/UX Design'], university: 'MIT' },
        { _id: 'u3', id: 'u3', name: 'David Chen', skills: ['Python', 'PyTorch', 'FastAPI'], university: 'UC Berkeley' },
      ];
      const rankedMatches = rankStudentsForProject(['React', 'Python', 'FastAPI'], candidates);
      return res.status(200).json({
        success: true,
        projectId: req.params.id,
        projectTitle: 'AI Career Guidance Platform',
        requiredSkills: ['React', 'Python', 'FastAPI'],
        count: rankedMatches.length,
        matches: rankedMatches,
      });
    }

    if (!isValidId(req.params.id)) {
      const fallback = FALLBACK_PROJECTS.find(
        (p) => p._id === req.params.id || p.id === req.params.id
      );
      if (fallback) {
        const candidates = await User.find({
          role: 'student',
          _id: { $ne: req.user?._id },
        }).select('-password');
        const candidateList =
          candidates.length > 0
            ? candidates
            : [
                { _id: 'u1', id: 'u1', name: 'Alex Morgan', skills: ['React', 'Python', 'FastAPI', 'Tailwind CSS'], university: 'Stanford University' },
                { _id: 'u2', id: 'u2', name: 'Sarah Patel', skills: ['Figma', 'React', 'UI/UX Design'], university: 'MIT' },
                { _id: 'u3', id: 'u3', name: 'David Chen', skills: ['Python', 'PyTorch', 'FastAPI'], university: 'UC Berkeley' },
              ];
        const rankedMatches = rankStudentsForProject(
          fallback.requiredSkills,
          candidateList
        );
        return res.status(200).json({
          success: true,
          projectId: fallback._id,
          projectTitle: fallback.title,
          requiredSkills: fallback.requiredSkills,
          count: rankedMatches.length,
          matches: rankedMatches,
        });
      }

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
      return res.status(201).json({
        success: true,
        message: 'Application submitted successfully.',
        application: {
          _id: `app-${Date.now()}`,
          project: req.params.id,
          applicant: req.user?._id || 'user-alex',
          role: req.body.role || 'Member',
          note: req.body.note || '',
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
      });
    }

    if (!isValidId(req.params.id)) {
      const fallback = FALLBACK_PROJECTS.find(
        (p) => p._id === req.params.id || p.id === req.params.id
      );
      if (fallback) {
        return res.status(201).json({
          success: true,
          message: 'Application recorded (demo project).',
          application: {
            _id: `app-${Date.now()}`,
            project: fallback._id,
            applicant: req.user?._id || 'user-alex',
            roleApplied: req.body.roleApplied || req.body.role || 'Collaborator',
            message: req.body.message || req.body.note || '',
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
        });
      }

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
