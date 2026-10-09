import Notification from '../models/Notification.js';

let ioInstance = null;

export const setIO = (io) => {
  ioInstance = io;
};

export const createNotification = async ({
  recipient,
  sender,
  senderName = 'SkillBridge System',
  senderAvatar = '',
  type = 'system',
  title = 'Notification',
  message,
  relatedProject = null,
  relatedTeam = null,
  relatedTask = null,
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      senderName,
      senderAvatar,
      type,
      title,
      message,
      relatedProject,
      relatedTeam,
      relatedTask,
      isRead: false,
    });

    // Real-time broadcast if socket is connected
    if (ioInstance) {
      ioInstance.to(`user_${recipient.toString()}`).emit('new_notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('⚠️ [Notification Service Error]:', error.message);
    return null;
  }
};
