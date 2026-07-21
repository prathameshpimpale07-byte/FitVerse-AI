// utils/createNotification.js
// Helper to create a Notification in DB AND emit it to the user in real-time.

const Notification = require('../models/Notification');
const { emitNotification } = require('./socketManager');

/**
 * Create a notification and emit it via Socket.io.
 * @param {object} options
 * @param {string} options.userId     - MongoDB user _id
 * @param {string} options.title      - Notification title
 * @param {string} options.description - Notification body
 * @param {string} [options.category] - Workout | Diet | Water | Trainer | AI | Achievement | Challenge | Payment | Security | System
 * @param {string} [options.priority] - High | Medium | Low
 * @param {string} [options.actionUrl] - Internal route (e.g. /dashboard/trainers/bookings)
 * @param {string} [options.actionText] - Button label
 * @param {string} [options.icon]     - Icon key string
 */
const createNotification = async (options) => {
  const {
    title,
    description,
    category = 'System',
    priority = 'Medium',
    actionUrl = '',
    actionText = '',
    icon = 'HiBell',
  } = options;
  const userId = options.userId || options.user;
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      description,
      category,
      priority,
      actionUrl,
      actionText,
      icon,
      isRead: false,
    });

    // Real-time push
    emitNotification(userId?.toString(), notification);

    return notification;
  } catch (error) {
    console.error('[Notification] Failed to create:', error.message);
    return null;
  }
};

module.exports = createNotification;
