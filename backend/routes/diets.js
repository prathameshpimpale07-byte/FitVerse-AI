const express = require("express");
const router = express.Router();
const { 
  getMyPlan, resetMyPlan, completeMeal, resetDayProgress, logWater, getFoods, getRecipes,
  getDiets, getDiet, createDiet, updateDiet, deleteDiet 
} = require('../controllers/dietController.js');
const { protect } = require('../middleware/auth.js');
const { admin } = require('../middleware/admin.js');

// Food and Recipe libraries (accessible by user)
router.get("/foods", getFoods);
router.get("/recipes", getRecipes);

// User Plan & Logs tracking
router.get("/my-plan", protect, getMyPlan);
router.delete("/my-plan", protect, resetMyPlan);
router.post("/complete-meal", protect, completeMeal);
router.post("/reset-day-progress", protect, resetDayProgress);
router.post("/water", protect, logWater);

// Fallbacks & standard items
router.get("/", getDiets);
router.get("/:id", getDiet);

// Admin CRUD controls
router.post("/", protect, admin, createDiet);
router.put("/:id", protect, admin, updateDiet);
router.delete("/:id", protect, admin, deleteDiet);

module.exports = router;
