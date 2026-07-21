var mongoose = require("mongoose");
    var trainerSchema = new mongoose.Schema(
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, default: "" },
        avatar: { type: String, default: "" },
        specialization: [{ type: String }],
        experience: { type: Number, default: 0 },
        // years
        bio: { type: String, default: "" },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        totalReviews: { type: Number, default: 0 },
        pricePerSession: { type: Number, default: 500 },
        availability: [
          {
            day: { type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
            slots: [String]
          }
        ],
        certifications: [{ type: String }],
        isActive: { type: Boolean, default: true }
      },
      { timestamps: true }
    );
    module.exports = mongoose.model("Trainer", trainerSchema);
