const express = require("express");
const router = express.Router();
const { protect } = require('../middleware/auth.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require('../models/User');
const Favorite = require('../models/Favorite');
const WorkoutHistory = require('../models/WorkoutHistory');
const PersonalRecord = require('../models/PersonalRecord');
const WorkoutPlan = require('../models/WorkoutPlan');
const AIConversation = require('../models/AIConversation');
const { admin } = require('../middleware/admin.js');
const UserDietPlan = require('../models/UserDietPlan');
const Progress = require('../models/Progress');
const { retrieveKnowledgeAndContext } = require('../utils/ragEngine');

const getImageUrlForMeal = async (foodsArray) => {
  if (!foodsArray || foodsArray.length === 0) return '';
  const query = foodsArray[0];
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await res.json();
    if (data.meals && data.meals.length > 0) {
      return data.meals[0].strMealThumb;
    }
  } catch (e) {
    console.error('Image fetch error:', e.message);
  }
  const lockId = Math.floor(Math.random() * 1000);
  return `https://loremflickr.com/600/400/${encodeURIComponent(query.split(' ')[0])},food?lock=${lockId}`;
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const generateWithFallback = async (prompt, customConfig = {}) => {
  const modelsToTry = [
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash"
  ];
  let lastError = null;
  for (const modelName of modelsToTry) {
    try {
      console.log(`[AI] Attempting generation with: ${modelName}`);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: 0.85,
          ...customConfig
        }
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) {
        console.log(`[AI] Generation successful using: ${modelName}`);
        return text;
      }
    } catch (err) {
      console.error(`[AI] Model ${modelName} failed:`, err.message || err);
      lastError = err;
    }
  }
  throw lastError || new Error("All generative AI models failed.");
};

// helper to parse JSON securely
const cleanAndParseJSON = (text) => {
  try {
    // Strip markdown code block wrappers if Gemini outputs them
    let cleanText = text.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith("```")) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    return JSON.parse(cleanText.trim());
  } catch (error) {
    console.error("JSON Parsing failed for text:", text);
    return null;
  }
};

// 1. AI Workout Generator
router.post("/generate-workout", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      gender, age, height, weight, goal, experience, 
      workoutDays, duration, equipment, medicalConditions, injuries, preference 
    } = req.body;

    if (age && Number(age) < 10) {
      return res.status(400).json({ success: false, message: "Age must be at least 10 years." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, message: "Gemini API key is missing" });
    }

    const user = await User.findById(userId);

    const systemPrompt = `You are a Certified Personal Trainer, Sports Nutrition Advisor, Recovery Coach, Fitness Motivator, and Progress Analyst.
You are designing a professional, highly structured weekly workout plan for a user with the following profile:
- Age: ${age || user.age || 25}
- Gender: ${gender || user.gender || 'male'}
- Height: ${height || user.height || 175}cm
- Weight: ${weight || user.weight || 70}kg
- Fitness Goal: ${goal || user.fitnessGoal || 'general fitness'}
- Workout Experience: ${experience || 'Intermediate'}
- Workout Days per Week: 6 days
- Target Session Duration: ${duration || 60} minutes
- Gym Equipment Available: ${equipment || 'Gym'}
- Medical Conditions: ${medicalConditions || 'None'}
- Injuries: ${injuries || 'None'}
- Workout Preference: ${preference || 'Mixed'}
- Plan Generation Seed: ${Date.now()}

IMPORTANT: You MUST generate workout routines for exactly 6 days: Monday, Tuesday, Wednesday, Thursday, Friday, and Saturday. Only Sunday should be a Rest Day (return an empty array [] for Sunday). Do not make Wednesday, Saturday, or any other weekdays rest days; they must contain workouts.

IMPORTANT: Generate a fresh, unique routine. Do not replicate the same exercises. Introduce variations in exercise selection, reps, and progression techniques.

Generate a structured weekly workout plan in EXACT JSON format. Do not include any markdown wrappers or introductory texts, only return the raw JSON matching the following structure:
{
  "weeklySplit": {
    "Monday": [
      { "exerciseName": "Bench Press", "sets": 4, "reps": "10-12", "rest": "90 sec" }
    ]
  },
  "progressiveOverloadSuggestions": "Increase weight by 2.5kg when you hit 12 reps on all sets.",
  "warmUp": "5-10 minutes of active stretching and light cardio.",
  "coolDown": "5-10 minutes of static stretching for target muscles.",
  "recoveryAdvice": "Sleep 8 hours, consume 1.6g protein per kg bodyweight, hydrate.",
  "motivation": "Your only limit is you. Push hard and be consistent!"
}
Fill out all days of the weekly split based on the workout days per week. Avoid duplicate exercises per day. Include proper recovery days. Use exercise names that are standard.`;

    const textResponse = await generateWithFallback(systemPrompt);

    const parsedPlan = cleanAndParseJSON(textResponse);
    if (!parsedPlan) {
      return res.status(500).json({ 
        success: false, 
        message: "Failed to parse AI-generated plan. Please try again.",
        raw: textResponse 
      });
    }

    // Deactivate previous active plans
    await WorkoutPlan.updateMany({ userId }, { isActive: false });

    // Save the new plan in database
    const newPlan = await WorkoutPlan.create({
      userId,
      weeklySplit: parsedPlan.weeklySplit,
      progressiveOverloadSuggestions: parsedPlan.progressiveOverloadSuggestions,
      warmUp: parsedPlan.warmUp,
      coolDown: parsedPlan.coolDown,
      recoveryAdvice: parsedPlan.recoveryAdvice,
      motivation: parsedPlan.motivation,
      isActive: true
    });

    res.json({ success: true, plan: newPlan });
  } catch (error) {
    console.error("Gemini Workout Generation Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate workout plan from AI." });
  }
});

// Get User's Active Workout Plan
router.get("/my-plan", protect, async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ userId: req.user._id, isActive: true });
    if (!plan) {
      return res.json({ success: true, plan: null, message: "No active plan found." });
    }
    res.json({ success: true, plan });
  } catch (error) {
    console.error("Fetch Active Plan Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching active plan." });
  }
});

// 2. AI Workout Coach
router.post("/chat", protect, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required." });
    }

    const userId = req.user._id;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, message: "Gemini API key is missing" });
    }

    // Load User Profile Context
    const user = await User.findById(userId).select('-password');
    const favorites = await Favorite.findOne({ userId }).populate('exerciseIds');
    const history = await WorkoutHistory.find({ userId }).sort({ completedAt: -1 }).limit(3);
    const prs = await PersonalRecord.find({ userId });

    // Load Chat History
    let conversation = await AIConversation.findOne({ userId });
    if (!conversation) {
      conversation = await AIConversation.create({ userId, messages: [] });
    }

    // Execute RAG Engine: Retrieve Knowledge Articles & User Context
    const { augmentedPrompt, retrievedDocs } = await retrieveKnowledgeAndContext(userId, message);

    const systemPrompt = `${augmentedPrompt}

CRITICAL FORMATTING RULES:
1. Always use Markdown formatting to make your responses visually appealing and easy to read.
2. 🚨 USE EMOJIS LIBERALLY! 🚨 Every single bullet point, heading, and paragraph should contain relevant emojis (e.g., 🔥, 💪, 🥗, 🏋️‍♂️, ⚡, 🧠, 💧, 📈).
3. Structure answers using bullet points (• or emojis) under bold headers.
4. If recommending exercises, list them as: • Exercise Name — sets x reps (rest period) — brief tip on form.
5. End every response with a strong motivational line prefixed with 🎯.
6. Jump straight into the value. Do NOT wrap in markdown code blocks or prefix with "Coach:".`;

    const rawReply = await generateWithFallback(systemPrompt, { temperature: 0.7 });
    const replyText = rawReply.trim();

    // Save user message and model response to history
    conversation.messages.push({ role: 'user', content: message, retrievedDocs });
    conversation.messages.push({ role: 'model', content: replyText, retrievedDocs });
    
    // Cap chat history at 30 messages to avoid database bloat
    if (conversation.messages.length > 30) {
      conversation.messages = conversation.messages.slice(-30);
    }
    await conversation.save();

    res.json({ success: true, reply: replyText, messages: conversation.messages, retrievedDocs });
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ success: false, message: "Failed to process chat message." });
  }
});

// Get AI Chat Logs
router.get("/chat-history", protect, async (req, res) => {
  try {
    const conversation = await AIConversation.findOne({ userId: req.user._id });
    res.json({ success: true, messages: conversation ? conversation.messages : [] });
  } catch (error) {
    console.error("Fetch Chat History Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching chat logs." });
  }
});

// 2. AI Diet Generator
router.post("/generate-diet", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      gender, age, height, weight, goalWeight, goal, activityLevel,
      workoutDays, workoutTime, preference, country, state, budget,
      allergies, medicalConditions, dailyMeals, waterIntake, cookingSkill,
      availability, supplements, sleepTime, wakeTime, dietDuration
    } = req.body;

    if (age && Number(age) < 10) {
      return res.status(400).json({ success: false, message: "Age must be 10 years and above" });
    }

    const systemPrompt = `You are a Certified Nutritionist, Dietitian, and AI Health Coach.
You are designing a professional, personalized weekly nutrition and meal plan for a user with the following profile:
- Age: ${age || 25}
- Gender: ${gender || 'male'}
- Height: ${height || 175}cm
- Weight: ${weight || 70}kg
- Target Goal Weight: ${goalWeight || 70}kg
- Fitness Goal: ${goal || 'general fitness'}
- Activity Level: ${activityLevel || 'Active'}
- Workout Frequency: ${workoutDays || 6} days/week
- Workout Time: ${workoutTime || '6:00 PM'}
- Dietary Preference: ${preference || 'mixed'}
- Country/State: ${country || 'India'}, ${state || 'Maharashtra'}
- Daily Food Budget: ${budget || '₹300'}
- Allergies: ${allergies || 'None'}
- Medical Notes: ${medicalConditions || 'None'}
- Sleep/Wake Cycle: Sleep at ${sleepTime || '11:00 PM'}, Wake at ${wakeTime || '6:00 AM'}
- Cooking Skill: ${cookingSkill || 'Intermediate'}
- Supplements: ${supplements || 'None'}
- Target Daily Meals Count: ${dailyMeals || 4} meals
- Diet Plan Duration: ${dietDuration || 1} Days

Generate a structured multi-day diet plan in EXACT JSON format. Do not include any markdown wrappers or introductory texts, only return the raw JSON matching the following structure:
{
  "dailyCalories": 2400,
  "protein": "140g",
  "carbs": "280g",
  "fat": "65g",
  "water": "3.5L",
  "dailyPlans": [
    {
      "dayNumber": 1,
      "dayName": "Day 1",
      "meals": [
        {
          "meal": "Breakfast",
          "time": "8:00 AM",
          "foods": ["Oats", "Milk", "Banana", "Peanut Butter"],
          "prepTime": 10,
          "recipe": "Boil oats...",
          "calories": 520,
          "protein": 18,
          "carbs": 72,
          "fat": 14
        }
      ]
    }
  ],
  "shoppingList": ["Oats", "Milk", "Bananas"]
}

Important Rules:
1. Adjust calories and macros carefully based on user's metrics and fitness goal.
2. Respect allergies, budget limits, and dietary preference.
3. Align meal timings with sleep, wake, and workout times.
4. Generate exactly ${dietDuration || 1} unique daily plans in the dailyPlans array, incrementing dayNumber and dayName for each.`;

    const textResponse = await generateWithFallback(systemPrompt);
    const parsedPlan = cleanAndParseJSON(textResponse);

    // Fetch images for daily plans
    if (parsedPlan.dailyPlans) {
      for (let day of parsedPlan.dailyPlans) {
        if (day.meals) {
          for (let meal of day.meals) {
            meal.imageUrl = await getImageUrlForMeal(meal.foods);
          }
        }
      }
    }
    // Fetch images for fallback meals
    if (parsedPlan.meals) {
      for (let meal of parsedPlan.meals) {
        if (!meal.imageUrl) {
          meal.imageUrl = await getImageUrlForMeal(meal.foods);
        }
      }
    }

    if (!parsedPlan) {
      return res.status(500).json({ success: false, message: "Failed to parse AI-generated diet plan." });
    }

    // Save or update user's plan in DB
    let userPlan = await UserDietPlan.findOne({ userId });
    if (userPlan) {
      userPlan.dailyCalories = parsedPlan.dailyCalories;
      userPlan.protein = parsedPlan.protein;
      userPlan.carbs = parsedPlan.carbs;
      userPlan.fat = parsedPlan.fat;
      userPlan.water = parsedPlan.water;
      userPlan.goal = goal || 'general_fitness';
      userPlan.dailyPlans = parsedPlan.dailyPlans || [];
      if (parsedPlan.meals) userPlan.meals = parsedPlan.meals; // Fallback
      userPlan.shoppingList = parsedPlan.shoppingList;
    } else {
      userPlan = new UserDietPlan({
        userId,
        dailyCalories: parsedPlan.dailyCalories,
        protein: parsedPlan.protein,
        carbs: parsedPlan.carbs,
        fat: parsedPlan.fat,
        water: parsedPlan.water,
        goal: goal || 'general_fitness',
        dailyPlans: parsedPlan.dailyPlans || [],
        meals: parsedPlan.meals || [],
        shoppingList: parsedPlan.shoppingList
      });
    }
    await userPlan.save();

    res.json({ success: true, plan: userPlan });
  } catch (error) {
    console.error("AI Diet Generation Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate AI diet plan." });
  }
});

// 3. AI Diet Coach Chat
router.post("/diet-chat", protect, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    let plan = await UserDietPlan.findOne({ userId });
    const user = await User.findById(userId);

    const systemPrompt = `You are a Certified Nutritionist, Dietitian, and AI Health Coach.
You are helping the user manage their nutrition and diet plan.
User Info:
- Name: ${user.name}
- Age: ${user.age || 25}
- Gender: ${user.gender}
- Height: ${user.height || 175}cm
- Weight: ${user.weight || 70}kg
- Fitness Goal: ${user.fitnessGoal}

Current Active Diet Plan:
${plan ? JSON.stringify(plan.meals, null, 2) : 'No active plan generated yet.'}

Guidelines:
1. Address the user's diet request. If they want to swap a food (e.g. "I don't like broccoli"), suggest a healthy alternative with similar macros (e.g. spinach or asparagus) and tell them exactly how it fits.
2. Keep responses brief, practical, and highly motivating (under 3 paragraphs).
3. If they ask you to modify their active plan, describe the changes clearly.

New User Message: "${message}"

Respond directly and concisely. Do not wrap in markdown.`;

    const rawReply = await generateWithFallback(systemPrompt, { temperature: 0.7 });
    const replyText = rawReply.trim();

    res.json({ success: true, reply: replyText });
  } catch (error) {
    console.error("AI Diet Coach Error:", error);
    res.status(500).json({ success: false, message: "Failed to connect to AI Diet Coach." });
  }
});

// AI Diet Alternative Foods
router.post("/get-food-alternatives", protect, async (req, res) => {
  try {
    const { mealType, foodToReplace } = req.body;
    if (!foodToReplace) {
      return res.status(400).json({ success: false, message: "Food item is required." });
    }

    const systemPrompt = `You are an expert AI Nutritionist.
The user wants to replace "${foodToReplace}" from their ${mealType || 'meal'}.
Suggest 3 healthy food alternatives that have a similar macronutrient profile (calories, protein, carbs, fat) and fit within a standard serving.
Return ONLY a valid JSON array of objects. Do not include markdown wrappers or explanations.
Example format:
[
  { "name": "Tofu", "calories": 140, "protein": 15, "carbs": 3, "fat": 8, "reason": "Great plant-based protein" },
  { "name": "Paneer", "calories": 260, "protein": 18, "carbs": 2, "fat": 20, "reason": "High protein and calcium" }
]
`;

    const textResponse = await generateWithFallback(systemPrompt);
    const alternatives = cleanAndParseJSON(textResponse);
    if (!alternatives || !Array.isArray(alternatives)) {
      return res.status(500).json({ success: false, message: "Failed to parse alternatives." });
    }

    res.json({ success: true, alternatives });
  } catch (error) {
    console.error("AI Alternative Generation Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate food alternatives." });
  }
});

// Swap Food in Diet Plan
router.post("/swap-food", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { mealType, oldFood, newFood, dayNumber } = req.body;

    const userPlan = await UserDietPlan.findOne({ userId });
    if (!userPlan) {
      return res.status(404).json({ success: false, message: "Diet plan not found." });
    }

    let mealArray = userPlan.meals;
    let dayIndex = -1;

    // If dayNumber is provided, target the specific day's meals
    if (dayNumber && userPlan.dailyPlans && userPlan.dailyPlans.length > 0) {
      dayIndex = userPlan.dailyPlans.findIndex(d => d.dayNumber === dayNumber);
      if (dayIndex !== -1) {
        mealArray = userPlan.dailyPlans[dayIndex].meals;
      }
    }

    // Find the meal
    const mealIndex = mealArray.findIndex(m => m.meal === mealType);
    if (mealIndex === -1) {
      return res.status(404).json({ success: false, message: "Meal not found in plan." });
    }

    const meal = mealArray[mealIndex];
    const foodIndex = meal.foods.indexOf(oldFood);
    if (foodIndex === -1) {
      return res.status(400).json({ success: false, message: "Old food item not found in the meal." });
    }

    // Replace food
    meal.foods[foodIndex] = newFood.name;
    mealArray[mealIndex] = meal;

    if (dayIndex !== -1) {
      userPlan.dailyPlans[dayIndex].meals = mealArray;
    } else {
      userPlan.meals = mealArray;
    }

    await userPlan.save();

    res.json({ success: true, plan: userPlan, message: "Food swapped successfully." });
  } catch (error) {
    console.error("Swap Food Error:", error);
    res.status(500).json({ success: false, message: "Server error swapping food." });
  }
});

// Clear AI Chat Logs
router.delete("/chat-history", protect, async (req, res) => {
  try {
    await AIConversation.deleteOne({ userId: req.user._id });
    res.json({ success: true, message: "Chat history cleared successfully." });
  } catch (error) {
    console.error("Clear Chat History Error:", error);
    res.status(500).json({ success: false, message: "Server error clearing chat logs." });
  }
});

// AI Progress Analysis
router.post("/progress-analysis", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    const logs = await Progress.find({ user: userId }).sort({ date: -1 }).limit(14); // Last 14 logs
    const workouts = await WorkoutHistory.find({ userId }).sort({ completedAt: -1 }).limit(10);
    
    if (logs.length === 0) {
      return res.json({ success: true, analysis: "Not enough data yet. Start logging your weight and measurements to get AI insights!" });
    }

    const latest = logs[0];
    const oldest = logs[logs.length - 1];
    
    const weightChange = latest.weight && oldest.weight ? (latest.weight - oldest.weight).toFixed(1) : 0;
    
    const systemPrompt = `You are FitVerse AI, a highly advanced fitness analytics engine.
Analyze the following user data and provide a concise, highly motivating progress report.

User Profile:
- Goal: ${user.fitnessGoal}
- Current Weight: ${latest.weight}kg (Change: ${weightChange > 0 ? '+'+weightChange : weightChange}kg)
- Current Body Fat: ${latest.bodyFat}%
- Workouts completed recently: ${workouts.length}

Provide your analysis in exactly this format:
Great progress! You [gained/lost] [X]kg in the last period.
Recommendation:
• [Actionable advice 1]
• [Actionable advice 2]
• [Actionable advice 3]

Be supportive, data-driven, and very brief.`;

    const rawReply = await generateWithFallback(systemPrompt, { temperature: 0.4 });
    res.json({ success: true, analysis: rawReply.trim() });
  } catch (error) {
    console.error("AI Progress Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate progress analysis." });
  }
});

module.exports = router;
