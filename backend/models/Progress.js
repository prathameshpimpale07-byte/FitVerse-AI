var mongoose = require("mongoose");
    var progressSchema = new mongoose.Schema(
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        date: { type: Date, default: Date.now },
        weight: { type: Number, default: 0 },
        bodyFat: { type: Number, default: 0 },
        muscleMass: { type: Number, default: 0 },
        chest: { type: Number, default: 0 },
        // cm
        waist: { type: Number, default: 0 },
        // cm
        hips: { type: Number, default: 0 },
        // cm
        arms: { type: Number, default: 0 },
        // cm
        workoutsCompleted: { type: Number, default: 0 },
        caloriesBurned: { type: Number, default: 0 },
        waterIntake: { type: Number, default: 0 }, // liters
        notes: { type: String, default: "" }
      },
      { timestamps: true }
    );
    module.exports = mongoose.model("Progress", progressSchema);
