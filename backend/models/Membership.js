var mongoose = require("mongoose");
    var membershipSchema = new mongoose.Schema(
      {
        name: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        price: { type: Number, required: true },
        duration: { type: Number, required: true },
        // days
        features: [{ type: String }],
        badge: { type: String, default: "\u{1F949}" },
        color: { type: String, default: "#6c63ff" },
        isPopular: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true }
      },
      { timestamps: true }
    );
    module.exports = mongoose.model("Membership", membershipSchema);
