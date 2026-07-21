const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Workout', 'Diet', 'Water', 'Trainer', 'System', 'AI', 'Security', 'Achievement', 'Challenge', 'Payment'],
      default: 'System',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    isRead: { type: Boolean, default: false },
    actionUrl: { type: String, default: '' },
    actionText: { type: String, default: '' },
    icon: { type: String, default: 'HiBell' }, // string reference to an icon component
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
