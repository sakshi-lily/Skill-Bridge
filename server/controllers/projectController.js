import mongoose from 'mongoose';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import { rankStudentsForProject, calculateSkillMatch } from '../utils/skillMatching.js';
import { createNotification } from '../services/notificationService.js';

const FALLBACK_PROJECTS = [
  {
    _id: '67040a1b89ef123456789001',
    id: 'career-guidance',
    title: 'AI-Powered Career Guidance Platform',
    shortDescription: 'An intelligent recommendation engine connecting students with personalized tech roadmaps, internship matches, and resume feedback.',
    detailedDescription: 'The AI-Powered Career Guidance Platform leverages state-of-the-art LLMs to evaluate student coursework, side projects, and github activity.',
    category: 'AI / Machine Learning',
    difficulty: 'Intermediate',
    mode: 'Remote',
    status: 'Recruiting',
    teamSize: 4,
    currentMembersCount: 2,
    openPositionsCount: 2,
    requiredSkills: ['Python', 'React', 'FastAPI', 'LangChain', 'Tailwind CSS'],
    deadline: 'Nov 15, 2026',
    owner: {
      name: 'Maya Lin',
      email: 'maya.lin@stanford.edu',
      university: 'Stanford University',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
    createdAt: '2026-10-01',
  },
  {
    _id: '67040a1b89ef123456789002',
    id: 'student-collaboration-portal',
    title: 'Student Collaboration Portal',
    shortDescription: 'A multi-campus hub for forming study circles, exchanging peer notes, and running sprint-based capstone projects.',
    category: 'Web Development',
    difficulty: 'Beginner',
    mode: 'Hybrid',
    status: 'Recruiting',
    teamSize: 3,
    currentMembersCount: 1,
    openPositionsCount: 2,
    requiredSkills: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'MongoDB'],
    deadline: 'Nov 30, 2026',
    owner: {
      name: 'Alex Morgan',
      email: 'alex.morgan@stanford.edu',
      university: 'Stanford University',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
    createdAt: '2026-10-03',
  },
  {
    _id: '67040a1b89ef123456789003',
    id: 'campuspulse-iot',
    title: 'CampusPulse — IoT Energy Grid Monitor',
    shortDescription: 'Smart sensor platform monitoring dormitory kilowatt consumption and HVAC metrics using Raspberry Pi and WebSockets.',
    category: 'IoT / Embedded Systems',
    difficulty: 'Advanced',
    mode: 'In-Person',
    status: 'Recruiting',
    teamSize: 5,
    currentMembersCount: 2,
    openPositionsCount: 3,
    requiredSkills: ['Python', 'C++', 'MQTT', 'React', 'InfluxDB', 'Docker'],
    deadline: 'Dec 10, 2026',
    owner: {
      name: 'David Chen',
      email: 'david.chen@berkeley.edu',
      university: 'UC Berkeley',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    },
    createdAt: '2026-10-05',
  },
];

/**
 * @desc    Get all projects with search & filters
 * @route   GET /api/projects
 * @access  Public / Optional Auth
 */
export const getProjects = async (req, res, next) => {
  try {
    const { search, category, difficulty, mode, status, sort } = req.query;

    // Standby fallback if DB disconnected
    if (mongoose.connection.readyState !== 1) {
      let filtered = [...FALLBACK_PROJECTS];
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(s) ||
          p.shortDescription.toLowerCase().includes(s) ||
          p.requiredSkills.some(skill => skill.toLowerCase().includes(s))
        );
      }
      if (category && category !== 'All' && category !== 'All Categories') {
        filtered = filtered.filter(p => p.category === category);
      }
      if (difficulty && difficulty !== 'All' && difficulty !== 'All Levels') {
        filtered = filtered.filter(p => p.difficulty === difficulty);
      }
      return res.status(200).json({
        success: true,
        count: filtered.length,
        projects: filtered,
      });
    }

    let query = {};

    // Search query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All' && category !== 'All Categories') {
      query.category = category;
    }

    // Difficulty filter
    if (difficulty && difficulty !== 'All' && difficulty !== 'All Levels') {
      query.difficulty = difficulty;
    }

    // Mode filter
    if (mode && mode !== 'All' && mode !== 'All Formats') {
      query.mode = mode;
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'deadline') {
      sortOption = { deadline: 1 };
    } else if (sort === 'teamSize') {
      sortOption = { teamSize: -1 };
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar university')
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/:id
 * @access  Public
 */
export const getProjectById = async (req, res, next) => {
  try {
    let project = null;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(req.params.id)) {
      project = await Project.findById(req.params.id)
        .populate('owner', 'name email avatar university bio major academicYear')
        .populate('members.user', 'name email avatar university skills');
    }

    if (!project) {
      project = FALLBACK_PROJECTS.find(p => p._id === req.params.id || p.id === req.params.id) || FALLBACK_PROJECTS[0];
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new project
 * @route   POST /api/projects
 * @access  Private
 */
export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      shortDescription,
      detailedDescription,
      problemStatement,
      objectives,
      requiredSkills,
      category,
      difficulty,
      teamSize,
      openPositionsCount,
      availableRoles,
      mode,
      weeklyCommitment,
      deadline,
      milestones,
    } = req.body;

    if (!title || !shortDescription || !requiredSkills) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, short description, and required skills.',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const mockProject = {
        _id: `proj-${Date.now()}`,
        id: `proj-${Date.now()}`,
        title,
        shortDescription,
        detailedDescription: detailedDescription || shortDescription,
        problemStatement: problemStatement || '',
        objectives: Array.isArray(objectives) ? objectives : [],
        requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [requiredSkills],
        category: category || 'Web Development',
        difficulty: difficulty || 'Intermediate',
        teamSize: Number(teamSize) || 4,
        openPositionsCount: Number(openPositionsCount) || 3,
        availableRoles: Array.isArray(availableRoles) ? availableRoles : ['Frontend Developer'],
        mode: mode || 'Remote',
        weeklyCommitment: weeklyCommitment || '6-8 hrs/week',
        deadline: deadline || 'Nov 30, 2026',
        milestones: Array.isArray(milestones) ? milestones : [],
        owner: {
          _id: req.user._id || req.user.id,
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar,
        },
        members: [
          {
            user: req.user._id || req.user.id,
            name: req.user.name,
            role: 'Project Lead',
            avatar: req.user.avatar,
          },
        ],
      };
      return res.status(201).json({
        success: true,
        project: mockProject,
      });
    }

    const project = await Project.create({
      title,
      shortDescription,
      detailedDescription: detailedDescription || shortDescription,
      problemStatement: problemStatement || '',
      objectives: Array.isArray(objectives) ? objectives : [],
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [requiredSkills],
      category: category || 'Web Development',
      difficulty: difficulty || 'Intermediate',
      teamSize: Number(teamSize) || 4,
      openPositionsCount: Number(openPositionsCount) || 3,
      availableRoles: Array.isArray(availableRoles) ? availableRoles : ['Frontend Developer'],
      mode: mode || 'Remote',
      weeklyCommitment: weeklyCommitment || '6-8 hrs/week',
      deadline: deadline || 'Nov 30, 2026',
      milestones: Array.isArray(milestones) ? milestones : [],
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

    const populated = await Project.findById(project._id).populate('owner', 'name email avatar university');

    res.status(201).json({
      success: true,
      project: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private (Owner or Admin)
 */
export const updateProject = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1 || !mongoose.isValidObjectId(req.params.id)) {
      const existing = FALLBACK_PROJECTS.find(p => p._id === req.params.id || p.id === req.params.id) || FALLBACK_PROJECTS[0];
      return res.status(200).json({
        success: true,
        project: { ...existing, ...req.body },
      });
    }

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    // Ownership check
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project.',
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('owner', 'name email avatar university');

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private (Owner or Admin)
 */
export const deleteProject = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1 || !mongoose.isValidObjectId(req.params.id)) {
      return res.status(200).json({
        success: true,
        message: 'Project deleted successfully.',
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    // Ownership check
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project.',
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get rule-based skill matches for a project
 * @route   GET /api/projects/:id/matches
 * @access  Private
 */
export const getProjectMatches = async (req, res, next) => {
  try {
    let project = null;
    let candidates = [];

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(req.params.id)) {
      project = await Project.findById(req.params.id);
      if (project) {
        candidates = await User.find({
          role: 'student',
          _id: { $ne: req.user._id },
        }).select('-password');
      }
    }

    if (!project) {
      project = FALLBACK_PROJECTS.find(p => p._id === req.params.id || p.id === req.params.id) || FALLBACK_PROJECTS[0];
      candidates = [
        {
          _id: 'sarah-patel',
          name: 'Sarah Patel',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
          university: 'MIT',
          skills: ['Figma', 'UI/UX Design', 'Tailwind CSS', 'React', 'User Research'],
          major: 'Design Engineering',
          academicYear: 'Year 4',
        },
        {
          _id: 'david-chen',
          name: 'David Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
          university: 'UC Berkeley',
          skills: ['Python', 'Docker', 'FastAPI', 'PyTorch', 'React'],
          major: 'EECS',
          academicYear: 'Year 3',
        },
        {
          _id: 'elena-rodriguez',
          name: 'Elena Rodriguez',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
          university: 'Stanford University',
          skills: ['Python', 'PostgreSQL', 'FastAPI', 'AWS'],
          major: 'Computer Science',
          academicYear: 'Year 3',
        },
      ];
    }

    // Perform rule-based skill matching
    const rankedMatches = rankStudentsForProject(project.requiredSkills, candidates);

    res.status(200).json({
      success: true,
      projectId: project._id || project.id,
      projectTitle: project.title,
      requiredSkills: project.requiredSkills,
      count: rankedMatches.length,
      matches: rankedMatches,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Apply to join project
 * @route   POST /api/projects/:id/apply
 * @access  Private
 */
export const applyToProject = async (req, res, next) => {
  try {
    let project = null;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(req.params.id)) {
      project = await Project.findById(req.params.id);
    } else {
      project = FALLBACK_PROJECTS.find(p => p._id === req.params.id || p.id === req.params.id) || FALLBACK_PROJECTS[0];
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    if (mongoose.connection.readyState === 1) {
      // Cannot apply to own project
      if (project.owner && project.owner.toString() === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'You are the owner of this project.',
        });
      }

      // Check if already applied
      const existing = await Application.findOne({
        project: project._id,
        applicant: req.user._id,
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: `You have already applied to this project. Current status: ${existing.status}.`,
        });
      }

      const application = await Application.create({
        project: project._id,
        applicant: req.user._id,
        roleApplied: req.body.roleApplied || req.body.role || 'Collaborator',
        message: req.body.message || req.body.note || '',
      });

      // Notify project owner
      await createNotification({
        recipient: project.owner,
        sender: req.user._id,
        senderName: req.user.name,
        senderAvatar: req.user.avatar,
        type: 'application',
        title: 'New Project Application',
        message: `${req.user.name} applied for role '${application.roleApplied}' on ${project.title}.`,
        relatedProject: project._id,
      });

      return res.status(201).json({
        success: true,
        message: 'Application submitted successfully.',
        application,
      });
    }

    // Standby mock response
    const mockApp = {
      _id: `app-${Date.now()}`,
      project: project._id || project.id,
      applicant: req.user._id || req.user.id,
      roleApplied: req.body.roleApplied || req.body.role || 'Collaborator',
      message: req.body.message || req.body.note || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      application: mockApp,
    });
  } catch (error) {
    next(error);
  }
};
