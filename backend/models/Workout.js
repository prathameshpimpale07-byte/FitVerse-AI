const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  workoutName: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  category: {
    type: String,
    enum: ["strength", "cardio", "flexibility", "hiit", "yoga", "pilates", "crossfit", "other"],
    default: "strength"
  },
  difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
  duration: { type: Number, default: 30 }, // minutes
  calories: { type: Number, default: 0 },
  goal: { type: String, default: "General Fitness" },
  image: { type: String, default: "" },
  exercises: [
    {
      exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
      sets: { type: Number, default: 3 },
      reps: { type: String, default: "10" },
      restTime: { type: Number, default: 60 } // seconds
    }
  ],
  tags: [{ type: String }],
  isPublic: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Workout", workoutSchema);
