const cron = require('node-cron');
const User = require('../models/User');
const Notification = require('../models/Notification');
const createNotification = require('./createNotification');

const initCronJobs = () => {
  console.log('⏳ Notification Cron Jobs Initialized');

  // 1. Midnight (00:00) - Daily Reset & Cleanup
  cron.schedule('0 0 * * *', async () => {
    console.log('🔄 Running Midnight Reset...');
    try {
      // Clear all older notifications that are read, or just system generated ones to keep it fresh
      await Notification.deleteMany({ category: { $in: ['System', 'AI', 'Diet', 'Workout'] } });
      console.log('✅ Cleared old daily notifications for fresh start');
    } catch (err) {
      console.error('Error in midnight cron:', err);
    }
  });

  // Helper to send to all users
  const notifyAll = async (payload) => {
    try {
      const users = await User.find({});
      for (const user of users) {
        await createNotification({
          user: user._id,
          ...payload
        });
      }
    } catch (err) {
      console.error('Error notifying all users:', err);
    }
  };

  // 2. Morning (08:00 AM) - Wake up & Workout
  cron.schedule('0 8 * * *', () => {
    console.log('🌅 Sending Morning Notifications...');
    notifyAll({
      title: '🌅 Good Morning!',
      description: 'Start your day with a glass of water and get ready to crush your workout goals.',
      category: 'Workout',
      priority: 'High',
      icon: 'FaDumbbell'
    });
  });

  // 3. Lunch Time (01:00 PM) - Diet Reminder
  cron.schedule('0 13 * * *', () => {
    console.log('🥗 Sending Lunch Notifications...');
    notifyAll({
      title: '🥗 Lunch Time Reminder',
      description: 'Make sure your lunch is packed with proteins and healthy carbs to fuel your recovery.',
      category: 'Diet',
      priority: 'Medium',
      icon: 'FaAppleAlt'
    });
  });

  // 4. Evening (06:00 PM) - AI Daily Review
  cron.schedule('0 18 * * *', () => {
    console.log('🤖 Sending Evening AI Notifications...');
    notifyAll({
      title: '🤖 AI Daily Review',
      description: 'Your activity looks great today. Based on your stats, focus on mobility and stretching this evening.',
      category: 'AI',
      priority: 'Medium',
      icon: 'FaRobot'
    });
  });

  // 5. Night (09:00 PM) - Wind down
  cron.schedule('0 21 * * *', () => {
    console.log('🌙 Sending Night Notifications...');
    notifyAll({
      title: '🌙 Time to Wind Down',
      description: 'Sleep is the best recovery. Try to get 7-8 hours of sleep tonight for maximum muscle growth.',
      category: 'System',
      priority: 'Low',
      icon: 'FaBed'
    });
  });
};

module.exports = { initCronJobs };
