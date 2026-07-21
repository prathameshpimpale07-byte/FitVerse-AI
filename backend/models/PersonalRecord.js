const mongoose = require('mongoose');

const personalRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exerciseName: { type: String, required: true }, // e.g., "Bench Press", "Squat", "Deadlift", "Plank"
  value: { type: Number, required: true }, // weight in kg/lbs, or time in seconds, or distance
  unit: { type: String, required: true }, // e.g., "kg", "lbs", "sec", "min"
  achievedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Avoid duplicate PR records for the same user, exercise, and value
personalRecordSchema.index({ userId: 1, exerciseName: 1, value: 1 }, { unique: true });

module.exports = mongoose.model('PersonalRecord', personalRecordSchema);
