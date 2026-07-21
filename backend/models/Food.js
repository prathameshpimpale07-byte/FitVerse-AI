const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  foodName: { type: String, required: true, trim: true, unique: true },
  category: { 
    type: String, 
    enum: ['breakfast', 'lunch', 'dinner', 'snack'], 
    required: true 
  },
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 }, // grams
  carbs: { type: Number, default: 0 },   // grams
  fat: { type: Number, default: 0 },     // grams
  fiber: { type: Number, default: 0 },   // grams
  servingSize: { type: String, default: '100g' },
  prepTime: { type: Number, default: 10 }, // minutes
  imageUrl: { type: String, default: '' },
  recipe: [{ type: String }],
  alternativeFoods: [{ type: String }],
  cost: { type: Number, default: 100 } // estimated cost in INR
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
