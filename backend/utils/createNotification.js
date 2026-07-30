const Notification = require('../models/Notification');
const User = require('../models/User');
const { emitNotification } = require('./socketManager');
const { sendNotificationEmail } = require('./emailService');

/**
 * Create a notification, emit it via Socket.io, AND send an email notification to the user.
 * @param {object} options
 * @param {string|object} options.userId - MongoDB user _id or User document
 * @param {string|object} [options.user] - Alias for userId
 * @param {string} options.title      - Notification title
 * @param {string} options.description - Notification body
 * @param {string} [options.category] - Workout | Diet | Water | Trainer | AI | Achievement | Challenge | Payment | Security | System
 * @param {string} [options.priority] - High | Medium | Low
 * @param {string} [options.actionUrl] - Internal route (e.g. /dashboard/trainers/bookings)
 * @param {string} [options.actionText] - Button label
 * @param {string} [options.icon]     - Icon key string
 * @param {string} [options.userEmail] - Optional direct user email override
 * @param {string} [options.userName]  - Optional direct user name override
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

  let rawUser = options.userId || options.user;
  let userId = rawUser;
  let userEmail = options.userEmail || (typeof rawUser === 'object' ? rawUser.email : null);
  let userName = options.userName || (typeof rawUser === 'object' ? rawUser.name : null);

  if (typeof rawUser === 'object' && rawUser._id) {
    userId = rawUser._id;
  }

  try {
    // 1. Fetch user document to check preferences and registered email
    const userDoc = await User.findById(userId).select('name email notificationSettings');
    if (!userDoc) {
      console.warn(`[Notification] User not found: ${userId}`);
      return null;
    }

    userEmail = userEmail || userDoc.email;
    userName = userName || userDoc.name;

    const settings = userDoc.notificationSettings || {};

    // 2. Check category preferences
    let categoryAllowed = true;
    if (category === 'Workout' && settings.workoutReminder === false) categoryAllowed = false;
    if (category === 'Diet' && settings.dietReminder === false) categoryAllowed = false;
    if (category === 'Trainer' && settings.trainerReminder === false) categoryAllowed = false;
    if (category === 'AI' && settings.aiNotifications === false) categoryAllowed = false;

    if (!categoryAllowed) {
      console.log(`[Notification] Skipped notification for user ${userId} (${category} disabled in settings)`);
      return null;
    }

    // 3. Create Notification in DB
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

    // 4. Real-time push via Socket.io
    emitNotification(userId?.toString(), notification);

    // 5. Send Email Notification if emailNotifications is enabled (default true)
    const isEmailEnabled = settings.emailNotifications !== false;
    if (isEmailEnabled && userEmail) {
      (async () => {
        try {
          await sendNotificationEmail({
            to: userEmail,
            userName: userName || 'FitVerse Member',
            title,
            description,
            category,
            priority,
            actionUrl,
            actionText: actionText || 'View Notification',
          });
        } catch (emailErr) {
          console.error('[Notification Email Error]:', emailErr.message);
        }
      })();
    } else {
      console.log(`[Notification] Email notification skipped for ${userEmail} (emailNotifications is OFF)`);
    }

    return notification;
  } catch (error) {
    console.error('[Notification] Failed to create:', error.message);
    return null;
  }
};

module.exports = createNotification;

