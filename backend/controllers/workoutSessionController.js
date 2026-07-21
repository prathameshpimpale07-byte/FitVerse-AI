const WorkoutHistory = require('../models/WorkoutHistory');
const User = require('../models/User');

exports.startWorkout = async (req, res) => {
  try {
    // Starting a workout simply registers that a session is active and starts the client-side timer
    res.status(200).json({
      success: true,
      message: "Workout session started successfully.",
      sessionId: new Date().getTime().toString(),
      startedAt: new Date()
    });
  } catch (error) {
    console.error("Start Workout Error:", error);
    res.status(500).json({ success: false, message: "Server error starting workout session." });
  }
};

exports.completeWorkout = async (req, res) => {
  try {
    const { workoutId, workoutName, completedExercises, duration, rating, notes } = req.body;
    
    if (!workoutName || !completedExercises) {
      return res.status(400).json({ success: false, message: "Workout name and exercises are required." });
    }

    const userId = req.user._id;

    // Calculate calories burned: base 100 + 30 per exercise set
    let totalSets = 0;
    completedExercises.forEach(ex => {
      totalSets += Number(ex.setsCompleted) || 0;
    });
    const caloriesBurned = 100 + (totalSets * 15);

    // Create WorkoutHistory record
    const history = await WorkoutHistory.create({
      userId,
      workoutId: workoutId || null,
      workoutName,
      completedExercises,
      caloriesBurned,
      duration // in seconds
    });

    // Award XP and Coins
    const xpGained = 100 + (completedExercises.length * 20);
    const coinsGained = 50 + (completedExercises.length * 5);

    // Update User profile (XP, Coins, Streaks, Achievements)
    const user = await User.findById(userId);
    if (user) {
      user.xp = (user.xp || 0) + xpGained;
      user.coins = (user.coins || 0) + coinsGained;

      // Handle streaks
      const today = new Date().toDateString();
      const lastWorkout = user.lastWorkoutDate ? new Date(user.lastWorkoutDate).toDateString() : null;

      if (!lastWorkout) {
        user.streak = 1;
      } else if (today !== lastWorkout) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (new Date(user.lastWorkoutDate).toDateString() === yesterday.toDateString()) {
          user.streak += 1;
        } else {
          user.streak = 1;
        }
      }
      user.lastWorkoutDate = new Date();

      // Check achievements
      const achievements = [...user.achievements];
      if (user.streak >= 3 && !achievements.includes('Streak Master (3 Days)')) {
        achievements.push('Streak Master (3 Days)');
        user.notifications.push({ message: "🏆 Achievement Unlocked: Streak Master (3 Days)!" });
      }
      const historyCount = await WorkoutHistory.countDocuments({ userId });
      if (historyCount === 0 && !achievements.includes('First Steps')) {
        achievements.push('First Steps');
        user.notifications.push({ message: "🏆 Achievement Unlocked: Completed your first workout!" });
      }
      user.achievements = achievements;

      await user.save();
    }

    res.status(201).json({
      success: true,
      message: "Workout completed! Rewards granted.",
      data: {
        history,
        xpGained,
        coinsGained,
        streak: user ? user.streak : 1,
        totalXp: user ? user.xp : xpGained,
        totalCoins: user ? user.coins : coinsGained
      }
    });

  } catch (error) {
    console.error("Complete Workout Error:", error);
    res.status(500).json({ success: false, message: "Server error completing workout session." });
  }
};
