const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  exerciseName: { type: String, required: true },
  targetMuscle: { 
    type: String, 
    enum: ['chest', 'back', 'biceps', 'triceps', 'shoulders', 'legs', 'abs', 'cardio', 'full body', 'core'],
    required: true
  },
  secondaryMuscles: [{ type: String }],
  equipment: { type: String, default: 'Bodyweight' },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  instructions: [{ type: String }], // Array of steps
  tips: [{ type: String }], // Array of safety tips
  commonMistakes: [{ type: String }], // Array of mistakes
  videoUrl: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  estimatedCalories: { type: Number, default: 50 },
  estimatedDuration: { type: Number, default: 5 }, // minutes
}, { timestamps: true });

module.exports = mongoose.model('Exercise', exerciseSchema);
