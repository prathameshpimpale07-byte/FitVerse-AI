var Progress = require('../models/Progress.js');
var User = require('../models/User.js');
var WorkoutHistory = require('../models/WorkoutHistory.js');
var UserDietPlan = require('../models/UserDietPlan.js');

exports.getOverview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    // Get latest progress log
    const latestProgress = await Progress.findOne({ user: userId }).sort({ date: -1 });
    
    // Get workout count
    const workoutCount = await WorkoutHistory.countDocuments({ userId });
    
    // Get diet plan status
    const dietPlan = await UserDietPlan.findOne({ userId });
    
    res.json({
      success: true,
      overview: {
        goal: user.fitnessGoal,
        healthScore: Math.min(100, 50 + (workoutCount * 2) + (latestProgress ? 10 : 0)), // Dummy algorithm for now
        workoutCompletionRate: workoutCount > 0 ? Math.min(100, Math.round((workoutCount / 30) * 100)) : 0, // Assuming 30 is target
        dietCompletionRate: dietPlan ? 85 : 0, // Dummy value
        currentWeight: latestProgress?.weight || user.weight || 0,
        goalWeight: user.fitnessGoal === 'weight_loss' ? (user.weight - 5) : (user.fitnessGoal === 'muscle_gain' ? user.weight + 5 : user.weight),
        caloriesBurnedTotal: workoutCount * 300, // Dummy estimate
        workoutsCompleted: workoutCount,
        streak: user.streak || 0,
        bodyFat: latestProgress?.bodyFat || 0,
        muscleMass: latestProgress?.muscleMass || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProgress = async (req, res, next) => {
      try {
        const progress = await Progress.find({ user: req.user._id }).sort({ date: 1 });
        res.json({ success: true, progress });
      } catch (error) {
        next(error);
      }
    };
    exports.addProgress = async (req, res, next) => {
      try {
        const entry = await Progress.create({ ...req.body, user: req.user._id });
        res.status(201).json({ success: true, entry });
      } catch (error) {
        next(error);
      }
    };
    exports.updateProgress = async (req, res, next) => {
      try {
        const entry = await Progress.findOneAndUpdate(
          { _id: req.params.id, user: req.user._id },
          req.body,
          { new: true }
        );
        if (!entry) return res.status(404).json({ success: false, message: "Progress entry not found" });
        res.json({ success: true, entry });
      } catch (error) {
        next(error);
      }
    };
    exports.deleteProgress = async (req, res, next) => {
      try {
        await Progress.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        res.json({ success: true, message: "Progress entry deleted" });
      } catch (error) {
        next(error);
      }
    };
