const mongoose = require('mongoose');

const userDietPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  dailyCalories: { type: Number, required: true },
  protein: { type: String, required: true }, // e.g. "150g"
  carbs: { type: String, required: true },   // e.g. "300g"
  fat: { type: String, required: true },     // e.g. "70g"
  water: { type: String, default: '3.5L' },
  goal: { type: String, required: true },
  meals: [{
    meal: { type: String }, // Breakfast, Lunch, Dinner, Snack (Keep for backward compatibility)
    time: { type: String },
    foods: [{ type: String }],
    prepTime: { type: Number, default: 15 },
    recipe: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 }
  }],
  dailyPlans: [{
    dayNumber: { type: Number, required: true },
    dayName: { type: String, required: true },
    meals: [{
      meal: { type: String, required: true },
      time: { type: String, required: true },
      foods: [{ type: String }],
      prepTime: { type: Number, default: 15 },
      recipe: { type: String, default: '' },
      imageUrl: { type: String, default: '' },
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 }
    }]
  }],
  shoppingList: [{ type: String }],
  waterLogs: [{
    date: { type: String, required: true }, // YYYY-MM-DD
    intake: { type: Number, default: 0 }    // ml
  }],
  completedMealsLog: [{
    date: { type: String, required: true },  // YYYY-MM-DD
    meal: { type: String, required: true },  // Breakfast, Lunch, etc.
    status: { type: String, enum: ['Completed', 'Pending', 'Missed'], default: 'Pending' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('UserDietPlan', userDietPlanSchema);
