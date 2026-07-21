const mongoose = require('mongoose');
require('dotenv').config();
const Notification = require('./models/Notification');
const User = require('./models/User');

const seedNotifications = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');

    const dummyUser = await User.findOne({});
    if (!dummyUser) {
        console.log('No users found to seed notifications for.');
        process.exit();
    }
    const userId = dummyUser._id;

    // Clear existing notifications
    await Notification.deleteMany({});
    console.log('Cleared existing notifications');

    const notifications = [
      {
        user: userId,
        title: '🏋️ Time for your workout!',
        description: 'Start your Back Workout now. Your body needs consistency.',
        category: 'Workout',
        priority: 'High',
        isRead: false,
        icon: 'FaDumbbell',
      },
      {
        user: userId,
        title: '🥗 Lunch Time',
        description: "Don't forget your high-protein lunch.",
        category: 'Diet',
        priority: 'Medium',
        isRead: false,
        icon: 'FaAppleAlt',
      },
      {
        user: userId,
        title: '🤖 AI Suggestion',
        description: 'Today your recovery score is 94%. Train Chest Today.',
        category: 'AI',
        priority: 'Medium',
        isRead: false,
        icon: 'FaRobot',
      },
      {
        user: userId,
        title: '👨‍🏫 Your trainer session',
        description: 'Starts in 15 minutes. Get ready!',
        category: 'Trainer',
        priority: 'High',
        isRead: false,
        icon: 'FaUsers',
      },
      {
        user: userId,
        title: '📈 Weekly Report',
        description: 'Your fitness report is now ready.',
        category: 'System',
        priority: 'Low',
        isRead: true,
        icon: 'HiChartBar',
      },
    ];

    await Notification.insertMany(notifications);
    console.log('Successfully seeded notifications!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedNotifications();
