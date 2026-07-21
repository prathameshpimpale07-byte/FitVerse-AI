var mongoose = require("mongoose");
    var bookingSchema = new mongoose.Schema(
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        trainer: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true },
        date: { type: Date, required: true },
        slot: { type: String, required: true },
        status: {
          type: String,
          enum: ["pending", "confirmed", "cancelled", "completed"],
          default: "pending"
        },
        notes: { type: String, default: "" },
        sessionType: { type: String, enum: ["online", "offline"], default: "offline" },
        amount: { type: Number, default: 0 },
        paymentStatus: { type: String, enum: ["pending", "paid", "refunded"], default: "pending" }
      },
      { timestamps: true }
    );
    module.exports = mongoose.model("Booking", bookingSchema);
