const WorkoutHistory = require('../models/WorkoutHistory');

exports.getHistory = async (req, res, next) => {
  try {
    const history = await WorkoutHistory.find({ userId: req.user._id }).sort({ completedAt: -1 });
    res.status(200).json({ success: true, count: history.length, data: history });
  } catch (error) {
    next(error);
  }
};

exports.saveHistory = async (req, res, next) => {
  try {
    const { workoutId, workoutName, completedExercises, caloriesBurned, duration } = req.body;
    const history = await WorkoutHistory.create({
      userId: req.user._id,
      workoutId,
      workoutName,
      completedExercises,
      caloriesBurned,
      duration
    });
    res.status(201).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

exports.deleteHistory = async (req, res, next) => {
  try {
    const history = await WorkoutHistory.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!history) {
      return res.status(404).json({ success: false, message: "History record not found." });
    }
    res.status(200).json({ success: true, message: "Workout history deleted successfully." });
  } catch (error) {
    next(error);
  }
};
