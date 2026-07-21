var User = require('../models/User.js');
    exports.getUsers = async (req, res, next) => {
      try {
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });
        res.json({ success: true, count: users.length, users });
      } catch (error) {
        next(error);
      }
    };
    exports.getUser = async (req, res, next) => {
      try {
        const user = await User.findById(req.params.id).select("-password").populate("membership");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, user });
      } catch (error) {
        next(error);
      }
    };
    exports.updateProfile = async (req, res, next) => {
      try {
        const { name, phone, age, gender, height, weight, fitnessGoal, avatar } = req.body;
        const user = await User.findByIdAndUpdate(
          req.user._id,
          { name, phone, age, gender, height, weight, fitnessGoal, avatar },
          { new: true, runValidators: true }
        ).select("-password");
        res.json({ success: true, user });
      } catch (error) {
        next(error);
      }
    };
    exports.deleteUser = async (req, res, next) => {
      try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "User removed" });
      } catch (error) {
        next(error);
      }
    };
    exports.markNotification = async (req, res, next) => {
      try {
        const user = await User.findById(req.user._id);
        const notif = user.notifications.id(req.params.notifId);
        if (notif) notif.read = true;
        await user.save();
        res.json({ success: true, message: "Notification marked as read" });
      } catch (error) {
        next(error);
      }
    };
