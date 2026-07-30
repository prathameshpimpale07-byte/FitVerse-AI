var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var crypto = require("crypto");
    var userSchema = new mongoose.Schema(
      {
        name: { type: String, required: [true, "Name is required"], trim: true },
        email: {
          type: String,
          required: [true, "Email is required"],
          unique: true,
          lowercase: true,
          trim: true
        },
        password: { type: String, required: [true, "Password is required"], minlength: 6, select: false },
        role: { type: String, enum: ["user", "admin", "trainer"], default: "user" },
        avatar: { type: String, default: "" },
        phone: { type: String, default: "" },
        age: { type: Number, default: 0 },
        gender: { type: String, enum: ["male", "female", "other"], default: "male" },
        height: { type: Number, default: 0 },
        // cm
        weight: { type: Number, default: 0 },
        // kg
        fitnessGoal: {
          type: String,
          enum: ["weight_loss", "muscle_gain", "endurance", "flexibility", "general_fitness"],
          default: "general_fitness"
        },
        membership: { type: mongoose.Schema.Types.ObjectId, ref: "Membership", default: null },
        membershipExpiry: { type: Date, default: null },
        streak: { type: Number, default: 0 },
        lastWorkoutDate: { type: Date, default: null },
        xp: { type: Number, default: 0 },
        coins: { type: Number, default: 0 },
        achievements: [{ type: String }],
        notifications: [
          {
            message: String,
            read: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now }
          }
        ],
        notificationSettings: {
          workoutReminder: { type: Boolean, default: true },
          dietReminder: { type: Boolean, default: true },
          trainerReminder: { type: Boolean, default: true },
          aiNotifications: { type: Boolean, default: true },
          emailNotifications: { type: Boolean, default: true },
          pushNotifications: { type: Boolean, default: true },
          quietHoursStart: { type: String, default: "22:00" },
          quietHoursEnd: { type: String, default: "07:00" }
        },
        isActive: { type: Boolean, default: true },
        resetPasswordToken: String,
        resetPasswordExpire: Date
      },
      { timestamps: true }
    );
    userSchema.pre("save", async function(next) {
      if (!this.isModified("password")) return next();
      this.password = await bcrypt.hash(this.password, 12);
      next();
    });
    userSchema.methods.matchPassword = async function(enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    };

    userSchema.methods.getResetPasswordToken = function() {
      const resetToken = crypto.randomBytes(20).toString("hex");
      this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
      return resetToken;
    };

    module.exports = mongoose.model("User", userSchema);
