const UserDietPlan = require('../models/UserDietPlan');
const Food = require('../models/Food');

// 1. Get Current User Diet Plan
exports.getMyPlan = async (req, res, next) => {
  try {
    let plan = await UserDietPlan.findOne({ userId: req.user._id });
    res.json({ success: true, plan });
  } catch (error) {
    next(error);
  }
};

// 2. Reset / Delete Current Diet Plan
exports.resetMyPlan = async (req, res, next) => {
  try {
    await UserDietPlan.findOneAndDelete({ userId: req.user._id });
    res.json({ success: true, message: 'Diet plan reset successfully.' });
  } catch (error) {
    next(error);
  }
};

// 3. Toggle Meal Completion for a specific date
exports.completeMeal = async (req, res, next) => {
  try {
    const { date, meal, status } = req.body; // status: 'Completed', 'Pending', 'Missed'
    if (!date || !meal || !status) {
      return res.status(400).json({ success: false, message: "Date, meal type, and status are required." });
    }

    let plan = await UserDietPlan.findOne({ userId: req.user._id });
    if (!plan) {
      return res.status(404).json({ success: false, message: "No active diet plan found. Please generate one first." });
    }

    // Check if log already exists for this date and meal
    const logIndex = plan.completedMealsLog.findIndex(log => log.date === date && log.meal === meal);
    if (logIndex > -1) {
      plan.completedMealsLog[logIndex].status = status;
    } else {
      plan.completedMealsLog.push({ date, meal, status });
    }

    await plan.save();
    res.json({ success: true, message: `Meal ${meal} marked as ${status}.`, plan });
  } catch (error) {
    next(error);
  }
};

// 3. Log daily water intake
exports.logWater = async (req, res, next) => {
  try {
    const { date, amount } = req.body; // amount in ml (e.g. 250, 500, 1000)
    if (!date || !amount) {
      return res.status(400).json({ success: false, message: "Date and amount are required." });
    }

    let plan = await UserDietPlan.findOne({ userId: req.user._id });
    if (!plan) {
      // Create a default plan wrapper if none exists, just to track water
      plan = new UserDietPlan({
        userId: req.user._id,
        dailyCalories: 2000,
        protein: '120g',
        carbs: '220g',
        fat: '60g',
        goal: 'general_fitness',
        meals: [],
        shoppingList: []
      });
    }

    // Check if water log already exists for this date
    const logIndex = plan.waterLogs.findIndex(log => log.date === date);
    if (logIndex > -1) {
      plan.waterLogs[logIndex].intake += Number(amount);
    } else {
      plan.waterLogs.push({ date, intake: Number(amount) });
    }

    await plan.save();
    res.json({ success: true, message: `Added ${amount}ml water.`, plan });
  } catch (error) {
    next(error);
  }
};

// 4. Get all verified foods from local database
exports.getFoods = async (req, res, next) => {
  try {
    const foods = await Food.find({});
    res.json({ success: true, count: foods.length, foods });
  } catch (error) {
    next(error);
  }
};

// 5. Get all recipes from local database
exports.getRecipes = async (req, res, next) => {
  try {
    // Find all foods that have at least one recipe instruction step
    const recipes = await Food.find({ "recipe.0": { $exists: true } });
    res.json({ success: true, count: recipes.length, recipes });
  } catch (error) {
    next(error);
  }
};

// Keep old admin methods just in case
exports.getDiets = async (req, res, next) => {
  try {
    const diets = await Food.find({});
    res.json({ success: true, count: diets.length, diets });
  } catch (error) {
    next(error);
  }
};
exports.getDiet = async (req, res, next) => {
  try {
    const diet = await Food.findById(req.params.id);
    res.json({ success: true, diet });
  } catch (error) {
    next(error);
  }
};
exports.createDiet = async (req, res, next) => {
  try {
    const diet = await Food.create(req.body);
    res.status(201).json({ success: true, diet });
  } catch (error) {
    next(error);
  }
};
exports.updateDiet = async (req, res, next) => {
  try {
    const diet = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, diet });
  } catch (error) {
    next(error);
  }
};
exports.deleteDiet = async (req, res, next) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    next(error);
  }
};
