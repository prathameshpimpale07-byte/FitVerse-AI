const User = require('../models/User');
const Progress = require('../models/Progress');
const Workout = require('../models/Workout');
const Booking = require('../models/Booking');
const UserDietPlan = require('../models/UserDietPlan');
const WorkoutPlan = require('../models/WorkoutPlan');
const WorkoutHistory = require('../models/WorkoutHistory');

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Today's date string YYYY-MM-DD
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;
    
    // Day Name (e.g. "Monday", "Tuesday", etc.)
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayDayName = daysOfWeek[today.getDay()];

    // 1. Get User Profile
    const user = await User.findById(userId).select('-password');

    // 2. Get Progress History (last 7 days for charts)
    const progressHistory = await Progress.find({ user: userId })
      .sort({ date: -1 })
      .limit(7);
    progressHistory.reverse();

    // 3. Get User Diet Plan & calculate Today's Water & Calories/Macros
    const userDietPlan = await UserDietPlan.findOne({ userId });
    let waterIntakeToday = 0; // in ml
    let consumedCaloriesToday = 0;
    let consumedProteinToday = 0;
    let consumedCarbsToday = 0;
    let consumedFatToday = 0;
    let completedMealsCount = 0;
    let dailyCaloriesGoal = 2000;
    let targetWater = 3500; // in ml
    let todayMeals = [];

    if (userDietPlan) {
      dailyCaloriesGoal = userDietPlan.dailyCalories || 2000;
      if (userDietPlan.water) {
        const parsedWater = parseFloat(userDietPlan.water) * 1000;
        if (!isNaN(parsedWater) && parsedWater > 0) targetWater = parsedWater;
      }

      // Check water log for today
      if (userDietPlan.waterLogs) {
        const log = userDietPlan.waterLogs.find(l => l.date === todayStr);
        if (log) waterIntakeToday = log.intake || 0;
      }

      // Target Macros
      const targetP = parseInt(userDietPlan.protein) || 140;
      const targetC = parseInt(userDietPlan.carbs) || 220;
      const targetF = parseInt(userDietPlan.fat) || 65;

      // Calculate consumed calories & macros today based on completedMealsLog
      if (userDietPlan.completedMealsLog) {
        const todayMealsLogs = userDietPlan.completedMealsLog.filter(
          log => log.date === todayStr && log.status === 'Completed'
        );
        completedMealsCount = todayMealsLogs.length;

        // All meals array from all dailyPlans or meals
        let allPlanMeals = [];
        if (userDietPlan.dailyPlans && userDietPlan.dailyPlans.length > 0) {
          userDietPlan.dailyPlans.forEach(dp => {
            if (dp.meals) allPlanMeals.push(...dp.meals);
          });
        }
        if (userDietPlan.meals && userDietPlan.meals.length > 0) {
          allPlanMeals.push(...userDietPlan.meals);
        }

        todayMealsLogs.forEach(mLog => {
          const match = allPlanMeals.find(m => 
            (m.meal && m.meal.toLowerCase() === mLog.meal.toLowerCase()) ||
            (m.name && m.name.toLowerCase() === mLog.meal.toLowerCase())
          );

          if (match) {
            consumedCaloriesToday += Number(match.calories) || Math.round(dailyCaloriesGoal / (allPlanMeals.length || 4));
            consumedProteinToday += Number(match.protein) || Math.round(targetP / 4);
            consumedCarbsToday += Number(match.carbs) || Math.round(targetC / 4);
            consumedFatToday += Number(match.fat) || Math.round(targetF / 4);
          } else {
            consumedCaloriesToday += Math.round(dailyCaloriesGoal / 4);
            consumedProteinToday += Math.round(targetP / 4);
            consumedCarbsToday += Math.round(targetC / 4);
            consumedFatToday += Math.round(targetF / 4);
          }
        });
      }

      // Today's active meals list for Dashboard display
      if (userDietPlan.dailyPlans && userDietPlan.dailyPlans.length > 0) {
        const todayDayNum = ((today.getDay() + 6) % 7) + 1; // 1 for Monday to 7 for Sunday
        const dayPlan = userDietPlan.dailyPlans.find(p => p.dayNumber === todayDayNum) || userDietPlan.dailyPlans[0];
        if (dayPlan && dayPlan.meals && dayPlan.meals.length > 0) {
          todayMeals = dayPlan.meals;
        } else {
          todayMeals = userDietPlan.dailyPlans[0]?.meals || userDietPlan.meals || [];
        }
      } else if (userDietPlan.meals && userDietPlan.meals.length > 0) {
        todayMeals = userDietPlan.meals;
      }
    }

    // 4. Get Active Workout Plan & Today's Exercises
    const activeWorkoutPlan = await WorkoutPlan.findOne({ userId, isActive: true });
    let todayWorkoutExercises = [];
    if (activeWorkoutPlan && activeWorkoutPlan.weeklySplit) {
      todayWorkoutExercises = activeWorkoutPlan.weeklySplit[todayDayName] || [];
    }

    // Fallback recommendation if no active plan
    let todaysWorkoutRecommendation = null;
    if (todayWorkoutExercises.length === 0) {
      todaysWorkoutRecommendation = await Workout.findOne({ 
        category: user.fitnessGoal === 'weight_loss' ? 'hiit' : 
                  user.fitnessGoal === 'muscle_gain' ? 'strength' : 'cardio'
      });
      if (!todaysWorkoutRecommendation) {
        todaysWorkoutRecommendation = await Workout.findOne();
      }
    }

    // 5. Get Workout History Stats
    const workoutHistoryLogs = await WorkoutHistory.find({ userId }).sort({ completedAt: -1 });
    const totalWorkoutsCompleted = workoutHistoryLogs.length;
    
    let totalCaloriesBurned = 0;
    let caloriesBurnedToday = 0;
    
    workoutHistoryLogs.forEach(log => {
      const burn = Number(log.caloriesBurned) || 0;
      totalCaloriesBurned += burn;

      if (log.completedAt) {
        const logDateStr = new Date(log.completedAt).toISOString().split('T')[0];
        if (logDateStr === todayStr) {
          caloriesBurnedToday += burn;
        }
      }
    });

    // 6. Get Upcoming Trainer Session
    const upcomingBooking = await Booking.findOne({ 
      user: userId, 
      status: 'confirmed',
      date: { $gte: new Date() }
    }).sort({ date: 1 }).populate('trainer', 'name specialization avatar');

    res.json({
      success: true,
      data: {
        user,
        progressHistory,
        userDietPlan: userDietPlan ? {
          dailyCaloriesGoal,
          consumedCaloriesToday,
          consumedProteinToday,
          consumedCarbsToday,
          consumedFatToday,
          waterIntakeToday,
          targetWater,
          completedMealsCount,
          protein: userDietPlan.protein || '140g',
          carbs: userDietPlan.carbs || '220g',
          fat: userDietPlan.fat || '65g',
          todayMeals: todayMeals.slice(0, 4)
        } : null,
        activeWorkoutPlan: activeWorkoutPlan ? {
          goal: activeWorkoutPlan.goal,
          equipment: activeWorkoutPlan.equipment,
          todayDayName,
          todayExercises: todayWorkoutExercises,
          warmUp: activeWorkoutPlan.warmUp,
          coolDown: activeWorkoutPlan.coolDown,
          motivation: activeWorkoutPlan.motivation
        } : null,
        todaysWorkoutRecommendation,
        workoutStats: {
          totalWorkoutsCompleted,
          totalCaloriesBurned,
          caloriesBurnedToday,
          recentWorkouts: workoutHistoryLogs.slice(0, 3)
        },
        upcomingBooking
      }
    });

  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching dashboard data" });
  }
};
