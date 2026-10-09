import Task from '../models/Task.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import { createNotification } from '../services/notificationService.js';

/**
 * @desc    Create new task
 * @route   POST /api/tasks
 * @access  Private
 */
export const createTask = async (req, res, next) => {
  try {
    const { title, description, teamId, assignedMemberId, priority, status, dueDate } = req.body;

    if (!title || !teamId || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Task title, team ID, and due date are required.',
      });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Associated team not found.',
      });
    }

    // Authorization: User must be a member of the team
    const isMember = team.members.some(m => m.user.toString() === req.user.id);
    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You must be a member of this team to create tasks.',
      });
    }

    // Resolve assigned member
    let assignedToObj = {
      user: req.user._id,
      name: req.user.name,
      avatar: req.user.avatar,
    };

    if (assignedMemberId) {
      const targetUser = await User.findById(assignedMemberId);
      if (targetUser) {
        assignedToObj = {
          user: targetUser._id,
          name: targetUser.name,
          avatar: targetUser.avatar,
        };
      }
    }

    const today = new Date().toISOString().split('T')[0];
    const isOverdue = dueDate < today && status !== 'Completed';

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || '',
      team: team._id,
      teamName: team.name,
      project: team.project,
      projectName: team.projectName,
      assignedTo: assignedToObj,
      creator: req.user._id,
      priority: priority || 'Medium',
      status: status || 'To Do',
      dueDate,
      isOverdue,
    });

    // Notify assignee if not creator
    if (assignedToObj.user.toString() !== req.user.id) {
      await createNotification({
        recipient: assignedToObj.user,
        sender: req.user._id,
        senderName: req.user.name,
        senderAvatar: req.user.avatar,
        type: 'task',
        title: 'New Task Assigned',
        message: `${req.user.name} assigned you the task '${task.title}' in team ${team.name}.`,
        relatedTeam: team._id,
        relatedTask: task._id,
      });
    }

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get tasks with filters
 * @route   GET /api/tasks
 * @access  Private
 */
export const getTasks = async (req, res, next) => {
  try {
    const { teamId, projectId, status, priority, assignedTo, overdue } = req.query;
    let query = {};

    if (teamId) query.team = teamId;
    if (projectId) query.project = projectId;
    if (status && status !== 'ALL') query.status = status;
    if (priority && priority !== 'ALL') query.priority = priority;

    if (assignedTo === 'ME') {
      query['assignedTo.user'] = req.user._id;
    } else if (assignedTo && assignedTo !== 'ALL') {
      query['assignedTo.user'] = assignedTo;
    }

    if (overdue === 'true') {
      query.isOverdue = true;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update task details or status
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    // Verify team membership
    const team = await Team.findById(task.team);
    if (team && !team.members.some(m => m.user.toString() === req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify tasks for this team.',
      });
    }

    const updates = { ...req.body };
    if (updates.dueDate || updates.status) {
      const dueDate = updates.dueDate || task.dueDate;
      const status = updates.status || task.status;
      const today = new Date().toISOString().split('T')[0];
      updates.isOverdue = dueDate < today && status !== 'Completed';
    }

    task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    // Verify ownership or team owner
    const team = await Team.findById(task.team);
    const isTeamOwner = team && team.owner.toString() === req.user.id;
    const isTaskCreator = task.creator.toString() === req.user.id;

    if (!isTeamOwner && !isTaskCreator && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task.',
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get task statistics for team or user
 * @route   GET /api/tasks/stats
 * @access  Private
 */
export const getTaskStats = async (req, res, next) => {
  try {
    const { teamId } = req.query;
    let query = {};
    if (teamId) {
      query.team = teamId;
    } else {
      query['assignedTo.user'] = req.user._id;
    }

    const tasks = await Task.find(query);
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const review = tasks.filter(t => t.status === 'Review').length;
    const todo = tasks.filter(t => t.status === 'To Do').length;
    const overdue = tasks.filter(t => t.isOverdue).length;

    res.status(200).json({
      success: true,
      stats: {
        total,
        completed,
        inProgress,
        review,
        todo,
        overdue,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
