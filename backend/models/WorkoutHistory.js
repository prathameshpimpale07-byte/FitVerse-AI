const mongoose = require('mongoose');

const workoutHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }, // Can be null if it was an AI-generated freeform workout
  workoutName: { type: String, required: true }, // Store name in case workout is deleted
  completedExercises: [
    {
      exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
      exerciseName: { type: String },
      setsCompleted: { type: Number, default: 0 },
      repsCompleted: { type: String, default: "" },
      weightUsed: { type: Number, default: 0 }
    }
  ],
  caloriesBurned: { type: Number, default: 0 },
  duration: { type: Number, required: true }, // seconds or minutes
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('WorkoutHistory', workoutHistorySchema);
