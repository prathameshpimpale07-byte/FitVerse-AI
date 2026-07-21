const User = require('../models/User');
const Progress = require('../models/Progress');
const Workout = require('../models/Workout');
const Diet = require('../models/Diet');
const Booking = require('../models/Booking');

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Get user profile stats
    const user = await User.findById(userId).select('-password');

    // 2. Get Progress History (last 7 days, sorted oldest to newest for charts)
    const progressHistory = await Progress.find({ user: userId })
      .sort({ date: -1 })
      .limit(7);
    progressHistory.reverse();

    // 3. Get Today's Workout recommendation (match fitness goal)
    let todaysWorkout = await Workout.findOne({ 
      category: user.fitnessGoal === 'weight_loss' ? 'hiit' : 
                user.fitnessGoal === 'muscle_gain' ? 'strength' : 'cardio'
    });
    if (!todaysWorkout) {
      // Fallback to any workout
      todaysWorkout = await Workout.findOne();
    }

    // 4. Get Today's Diet macros (match fitness goal)
    let todaysDiet = await Diet.findOne({ goal: user.fitnessGoal });
    if (!todaysDiet) {
      todaysDiet = await Diet.findOne();
    }

    // 5. Get Upcoming Trainer Session
    const upcomingBooking = await Booking.findOne({ 
      user: userId, 
      status: 'confirmed',
      date: { $gte: new Date() }
    }).sort({ date: 1 }).populate('trainer', 'name specialization');

    res.json({
      success: true,
      data: {
        user,
        progressHistory,
        todaysWorkout,
        todaysDiet,
        upcomingBooking
      }
    });

  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching dashboard data" });
  }
};
