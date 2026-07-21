var mongoose = require("mongoose");
    var dietSchema = new mongoose.Schema(
      {
        title: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        goal: {
          type: String,
          enum: ["weight_loss", "muscle_gain", "maintenance", "endurance"],
          default: "maintenance"
        },
        type: { type: String, enum: ["vegetarian", "vegan", "non-vegetarian", "keto", "paleo"], default: "non-vegetarian" },
        totalCalories: { type: Number, default: 2e3 },
        image: { type: String, default: "" },
        meals: [
          {
            mealType: { type: String, enum: ["breakfast", "lunch", "dinner", "snack"], required: true },
            name: { type: String, required: true },
            ingredients: [String],
            calories: { type: Number, default: 0 },
            protein: { type: Number, default: 0 },
            // grams
            carbs: { type: Number, default: 0 },
            // grams
            fats: { type: Number, default: 0 },
            // grams
            recipe: { type: String, default: "" },
            prepTime: { type: Number, default: 15 }
            // minutes
          }
        ],
        tags: [{ type: String }],
        isPublic: { type: Boolean, default: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
      },
      { timestamps: true }
    );
    module.exports = mongoose.model("Diet", dietSchema);
