const Notification = require('../models/Notification.js');
const User = require('../models/User.js');
const createNotification = require('../utils/createNotification.js');

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
    res.json({ success: true, count: notifications.length, unreadCount, notifications });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getNotificationSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('notificationSettings');
    const defaultSettings = {
      workoutReminder: true,
      dietReminder: true,
      trainerReminder: true,
      aiNotifications: true,
      emailNotifications: true,
      pushNotifications: true,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00',
    };
    const settings = { ...defaultSettings, ...(user?.notificationSettings?.toObject() || {}) };
    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

exports.updateNotificationSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.notificationSettings = {
      ...(user.notificationSettings?.toObject() || {}),
      ...req.body,
    };
    await user.save();

    res.json({
      success: true,
      message: 'Notification settings updated successfully',
      settings: user.notificationSettings,
    });
  } catch (error) {
    next(error);
  }
};


