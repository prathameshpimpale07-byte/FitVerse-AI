const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['pushup', 'cardio', 'leg', 'plank', '30day'], required: true },
  durationDays: { type: Number, default: 30 },
  rewards: {
    xp: { type: Number, default: 100 },
    coins: { type: Number, default: 50 }
  },
  target: { type: String, required: true }, // e.g., "100 pushups daily"
  participantsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);
