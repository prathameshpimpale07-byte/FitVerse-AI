var Workout = require('../models/Workout.js');
    exports.getWorkouts = async (req, res, next) => {
      try {
        const { category, level, search } = req.query;
        let query = { isPublic: true };
        if (category) query.category = category;
        if (level) query.level = level;
        if (search) query.title = { $regex: search, $options: "i" };
        const workouts = await Workout.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: workouts.length, workouts });
      } catch (error) {
        next(error);
      }
    };
    exports.getWorkout = async (req, res, next) => {
      try {
        const workout = await Workout.findById(req.params.id).populate("createdBy", "name");
        if (!workout) return res.status(404).json({ success: false, message: "Workout not found" });
        res.json({ success: true, workout });
      } catch (error) {
        next(error);
      }
    };
    exports.createWorkout = async (req, res, next) => {
      try {
        const workout = await Workout.create({ ...req.body, createdBy: req.user._id });
        res.status(201).json({ success: true, workout });
      } catch (error) {
        next(error);
      }
    };
    exports.updateWorkout = async (req, res, next) => {
      try {
        const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!workout) return res.status(404).json({ success: false, message: "Workout not found" });
        res.json({ success: true, workout });
      } catch (error) {
        next(error);
      }
    };
    exports.deleteWorkout = async (req, res, next) => {
      try {
        await Workout.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Workout deleted" });
      } catch (error) {
        next(error);
      }
    };
