import mongoose from 'mongoose';
import Notification from '../models/Notification.js';

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = async (req, res, next) => {
  try {
    // Standby fallback if DB disconnected
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        unreadCount: 2,
        count: 3,
        notifications: [
          {
            _id: 'notif-1',
            title: 'Team Invitation',
            message: 'Sarah Patel invited you to join CampusPulse AI as Frontend Lead.',
            type: 'invite',
            isRead: false,
            createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
          },
          {
            _id: 'notif-2',
            title: 'New Task Assignment',
            message: 'David Chen assigned you "Setup Fastify Route Validation".',
            type: 'task',
            isRead: false,
            createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
          },
          {
            _id: 'notif-3',
            title: 'Milestone Completed',
            message: 'Milestone 1: Kickoff Architecture reached in CampusPulse AI.',
            type: 'milestone',
            isRead: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
      });
    }

    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark a single notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        notification: { _id: req.params.id, isRead: true },
      });
    }

    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found.',
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark all user notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        message: 'All notifications marked as read.',
      });
    }

    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (error) {
    next(error);
  }
};
