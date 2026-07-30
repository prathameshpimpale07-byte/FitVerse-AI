const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goal: { type: String, default: 'muscle_gain' },
  equipment: { type: String, default: 'Gym' },
  workoutDays: { type: Number, default: 6 },
  weeklySplit: { type: mongoose.Schema.Types.Mixed, required: true }, // Monday: [...], Tuesday: [...], etc.
  progressiveOverloadSuggestions: { type: String, default: "" },
  warmUp: { type: String, default: "" },
  coolDown: { type: String, default: "" },
  recoveryAdvice: { type: String, default: "" },
  motivation: { type: String, default: "" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);

