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

const OFF_TOPIC_REFUSAL = "⚠️ **Scope Constraint**: I am your dedicated FitVerse AI Fitness & Nutrition Coach. I can only assist with workout routines, exercise form, gym training, diet plans, nutrition, health, and fitness goals. Please ask me a fitness or diet-related question! 💪🥗";

const isOffTopicQuery = (userQuery) => {
  if (!userQuery || typeof userQuery !== 'string') return true;
  const q = userQuery.toLowerCase().trim();

  // Keyword whitelist for fitness, gym, workouts, health & diet domain
  const fitnessKeywords = [
    'workout', 'work out', 'exercise', 'gym', 'muscle', 'chest', 'back', 'leg', 'arm', 'bicep', 'tricep',
    'shoulder', 'abs', 'core', 'cardio', 'run', 'jog', 'walk', 'bench', 'press', 'squat', 'deadlift', 'lunge',
    'dumbbell', 'barbell', 'weight', 'set', 'rep', 'hypertrophy', 'endurance', 'stamina', 'flexibility',
    'mobility', 'stretch', 'sore', 'soreness', 'doms', 'injury', 'pain', 'recovery', 'rest', 'sleep',
    'protein', 'carb', 'carbohydrate', 'fat', 'calorie', 'kcal', 'diet', 'food', 'meal', 'recipe',
    'breakfast', 'lunch', 'dinner', 'snack', 'vegan', 'veg', 'vegetarian', 'non-veg', 'keto', 'fast',
    'fasting', 'water', 'hydration', 'supplement', 'creatine', 'whey', 'bcaa', 'vitamin', 'lose',
    'gain', 'bulk', 'cut', 'fitness', 'body', 'bmi', 'health', 'train', 'trainer', 'coach', 'fitverse',
    'pushup', 'push-up', 'pullup', 'pull-up', 'plank', 'hiit', 'treadmill', 'gram', 'eat', 'eating',
    'drink', 'drinking', 'physique', 'form', 'posture', 'warmup', 'cooldown', 'calisthenics',
    'tdee', 'bmr', 'macro', 'micro', 'nutrient', 'nutrition', 'strength', 'waist', 'stomach', 'belly',
    'thigh', 'glute', 'butt', 'hip', 'calves', 'neck', 'trap', 'delt', 'lat', 'oblique', 'forearm',
    'mass', 'lean', 'obese', 'skinny', 'fat loss', 'weight loss', 'muscle gain', 'weight gain',
    'pre-workout', 'preworkout', 'post-workout', 'postworkout', 'shake', 'smoothie', 'egg', 'chicken',
    'fish', 'meat', 'rice', 'oats', 'oatmeal', 'milk', 'paneer', 'tofu', 'soya', 'fruit', 'apple',
    'banana', 'vegetable', 'salad', 'junk', 'cheat meal', 'sugar', 'salt', 'hi', 'hello', 'hey',
    'help', 'who are you', 'what can you do', 'advise', 'advice', 'tip', 'suggest', 'recommend'
  ];

  const hasFitnessKeyword = fitnessKeywords.some(kw => q.includes(kw));
  if (hasFitnessKeyword) return false;

  const offTopicTriggers = [
    'code', 'coding', 'program', 'programming', 'javascript', 'python', 'java', 'html', 'css', 'react',
    'node', 'sql', 'database', 'math', 'calculus', 'solve', 'equation', 'capital of', 'who is', 'who was',
    'president', 'movie', 'song', 'singer', 'joke', 'tell me a joke', 'game', 'gaming', 'politics',
    'weather', 'news', 'crypto', 'bitcoin', 'stock', 'essay', 'poem', 'story', 'translate', 'history',
    'geography', 'physics', 'chemistry'
  ];

  const hasOffTopicTrigger = offTopicTriggers.some(trigger => q.includes(trigger));
  if (hasOffTopicTrigger) return true;

  return false;
};

const MEAL_IMAGE_MAP = {
  oats: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&auto=format&fit=crop&q=80",
  oatmeal: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&auto=format&fit=crop&q=80",
  pancake: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&auto=format&fit=crop&q=80",
  egg: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
  omelet: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&auto=format&fit=crop&q=80",
  chicken: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
  rice: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&auto=format&fit=crop&q=80",
  paneer: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80",
  fish: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
  salmon: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
  smoothie: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80",
  shake: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80",
  yogurt: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80",
  fruit: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&auto=format&fit=crop&q=80",
  banana: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80",
  apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80",
  nuts: "https://images.unsplash.com/photo-1536591375315-1b836802e3a1?w=800&auto=format&fit=crop&q=80",
  almond: "https://images.unsplash.com/photo-1508061252966-177209772a80?w=800&auto=format&fit=crop&q=80",
  bread: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
  toast: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
  soup: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80",
  curry: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80",
  roti: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80",
  dal: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80"
};

const getImageUrlForMeal = async (foodsArray) => {
  if (!foodsArray || foodsArray.length === 0) {
    return "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80";
  }
  const text = foodsArray.join(' ').toLowerCase();
  for (const [key, url] of Object.entries(MEAL_IMAGE_MAP)) {
    if (text.includes(key)) {
      return url;
    }
  }
  return "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80";
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

    const userGoal = goal || user.fitnessGoal || 'muscle_gain';
    const userDays = parseInt(workoutDays) || 6;
    const userEquipment = equipment || 'Gym';
    const userAge = age || user.age || 25;
    const userGender = gender || user.gender || 'male';
    const userHeight = height || user.height || 175;
    const userWeight = weight || user.weight || 70;
    const userExperience = experience || 'Intermediate';
    const userDuration = duration || 60;
    const userMedical = medicalConditions || 'None';
    const userInjuries = injuries || 'None';
    const userPreference = preference || 'Mixed';

    // Goal-specific tailoring
    let goalInstructions = "";
    const cleanGoal = userGoal.toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (cleanGoal.includes('muscle') || cleanGoal.includes('hypertrophy') || cleanGoal.includes('bulk')) {
      goalInstructions = `
CRITICAL GOAL REQUIREMENT [MUSCLE GAIN / HYPERTROPHY]:
- Target: Muscle building, muscle hypertrophy, and progressive load strength gains.
- Exercises: Focus on compound muscle-building exercises (e.g. Bench Press, Incline Press, Squats, Deadlifts, Overhead Press, Barbell/Dumbbell Rows, Lat Pulldowns, Bicep Curls, Tricep Dip/Extensions, Leg Press).
- Sets & Reps: 3 to 4 sets of 8 to 12 reps per exercise (hypertrophy range).
- Rest: 60 to 90 seconds rest between sets.
- Structure: Clear split (e.g. Push, Pull, Legs, Upper, Lower).`;
    } else if (cleanGoal.includes('weight') || cleanGoal.includes('loss') || cleanGoal.includes('fat') || cleanGoal.includes('cut')) {
      goalInstructions = `
CRITICAL GOAL REQUIREMENT [WEIGHT LOSS / FAT BURN]:
- Target: High calorie expenditure, maximum fat burn, high heart rate, metabolic conditioning.
- Exercises: Focus on high-energy burning exercises, dynamic bodyweight/kettlebell movements, circuits, supersets, HIIT elements, and cardio conditioning (e.g. Burpees, Mountain Climbers, Jump Squats, Kettlebell Swings, Dumbbell Thrusters, High Knees, Box Jumps, Running/Jumping Jacks, Bicycle Crunches, Plank Jacks).
- Sets & Reps: 3 to 4 sets of 12 to 20 reps per exercise (or timed work intervals).
- Rest: Short rest periods of 30 to 45 seconds to maintain high heart rate in fat-burning zone.
- Structure: Full Body Conditioning, HIIT Circuits, Fat Burn splits.`;
    } else if (cleanGoal.includes('endurance') || cleanGoal.includes('stamina')) {
      goalInstructions = `
CRITICAL GOAL REQUIREMENT [ENDURANCE & STAMINA]:
- Target: Muscular endurance, aerobic stamina, cardiovascular health.
- Exercises: High-rep resistance movements, functional bodyweight, cardio intervals, jump rope, kettlebell circuits.
- Sets & Reps: 3 to 4 sets of 15 to 25 reps.
- Rest: 30 seconds rest.`;
    } else if (cleanGoal.includes('flexibility') || cleanGoal.includes('mobility')) {
      goalInstructions = `
CRITICAL GOAL REQUIREMENT [FLEXIBILITY & MOBILITY]:
- Target: Mobility, joint health, core stability, active recovery, postural control.
- Exercises: Dynamic stretches, resistance band mobility, bodyweight flows, cat-cow, glute bridges, bird-dogs, yoga-inspired movements.
- Sets & Reps: 2 to 3 sets of 10-15 controlled reps or 60-second active holds.
- Rest: 30 to 45 seconds.`;
    } else {
      goalInstructions = `
CRITICAL GOAL REQUIREMENT [GENERAL FITNESS]:
- Target: Balanced strength, core stability, moderate cardio health.
- Exercises: Mix of core strength movements and light cardio.
- Sets & Reps: 3 sets of 10 to 12 reps.
- Rest: 60 seconds rest.`;
    }

    // Equipment constraint instructions
    let equipmentInstructions = "";
    const cleanEquip = userEquipment.toLowerCase();
    if (cleanEquip.includes('bodyweight')) {
      equipmentInstructions = `
EQUIPMENT CONSTRAINT [BODYWEIGHT ONLY]:
- You MUST ONLY select bodyweight exercises that require ZERO equipment (e.g. Push-ups, Diamond Push-ups, Pike Push-ups, Bodyweight Squats, Lunges, Jump Squats, Planks, Burpees, Mountain Climbers, Dips, Glute Bridges).
- ABSOLUTELY DO NOT list exercises requiring barbells, dumbbells, cables, or gym machines!`;
    } else if (cleanEquip.includes('dumbbell')) {
      equipmentInstructions = `
EQUIPMENT CONSTRAINT [DUMBBELLS ONLY]:
- You MUST ONLY select exercises using Dumbbells or Bodyweight (e.g. Dumbbell Bench Press, Dumbbell Goblet Squats, Dumbbell Romanian Deadlifts, Dumbbell Rows, Dumbbell Overhead Press, Dumbbell Curls, Dumbbell Tricep Extensions, Lunges).
- ABSOLUTELY DO NOT list exercises requiring barbells, cable machines, or heavy gym equipment!`;
    } else {
      equipmentInstructions = `
EQUIPMENT CONSTRAINT [FULL GYM]:
- You have full access to Barbells, Dumbbells, Cable Machines, Leg Press, Lat Pulldowns, Smith Machine, and Bodyweight exercises.`;
    }

    // Weekly days instructions
    const daysInstructions = `
WEEKLY SCHEDULE CONSTRAINT:
- Target Training Days: ${userDays} days out of 7.
- Required day keys in JSON: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday".
- Provide exactly ${userDays} active workout days with 4-6 exercises tailored to the goal.
- For the remaining ${7 - userDays} days, return an empty array [] representing Rest / Recovery Days.`;

    let safetyInstructions = "";
    if (userInjuries && userInjuries !== 'None' && userInjuries.trim() !== '') {
      safetyInstructions += `\n- INJURY NOTICE: User has reported injury/pain in: "${userInjuries}". Avoid exercises that strain this area and suggest safe low-impact options.`;
    }
    if (userMedical && userMedical !== 'None' && userMedical.trim() !== '') {
      safetyInstructions += `\n- MEDICAL NOTICE: User has reported condition: "${userMedical}". Ensure exercise intensity is safe.`;
    }

    const systemPrompt = `You are an expert Certified Personal Trainer, Strength & Conditioning Specialist, and Sports Nutritionist.
You are generating a professional, customized 7-day workout plan strictly based on the following user inputs:

USER PROFILE & FORM INPUTS:
- Fitness Goal: ${userGoal}
- Equipment Available: ${userEquipment}
- Workout Days per Week: ${userDays}
- Target Session Duration: ${userDuration} minutes
- Experience Level: ${userExperience}
- Preference: ${userPreference}
- Age: ${userAge} | Gender: ${userGender} | Height: ${userHeight}cm | Weight: ${userWeight}kg
- Medical Conditions: ${userMedical}
- Reported Injuries: ${userInjuries}
- Seed: ${Date.now()}

${goalInstructions}

${equipmentInstructions}

${daysInstructions}
${safetyInstructions}

OUTPUT FORMAT RULES:
Return ONLY raw, valid JSON. Do not include markdown code block formatting (\`\`\`json), intro text, or extra commentary. The output must match this exact JSON structure:
{
  "weeklySplit": {
    "Monday": [
      { "exerciseName": "Bench Press", "sets": 3, "reps": "8-12", "rest": "60 sec" }
    ],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
    "Friday": [],
    "Saturday": [],
    "Sunday": []
  },
  "progressiveOverloadSuggestions": "Clear progressive overload strategy for ${userGoal}",
  "warmUp": "5-10 min dynamic warm-up routine for ${userGoal}",
  "coolDown": "5-10 min static cool-down stretch for target muscles",
  "recoveryAdvice": "Tailored recovery, protein/hydration advice for ${userGoal}",
  "motivation": "Inspiring motivation tailored to ${userGoal}"
}`;

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
      goal: userGoal,
      equipment: userEquipment,
      workoutDays: userDays,
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

    // Fast domain pre-check for obvious off-topic queries
    if (isOffTopicQuery(message)) {
      let conversation = await AIConversation.findOne({ userId });
      if (!conversation) {
        conversation = await AIConversation.create({ userId, messages: [] });
      }
      conversation.messages.push({ role: 'user', content: message });
      conversation.messages.push({ role: 'model', content: OFF_TOPIC_REFUSAL });
      if (conversation.messages.length > 30) {
        conversation.messages = conversation.messages.slice(-30);
      }
      await conversation.save();

      return res.json({ success: true, reply: OFF_TOPIC_REFUSAL, messages: conversation.messages });
    }

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

CRITICAL FORMATTING & SCOPE RULES:
1. MANDATORY DOMAIN RESTRICTION: You MUST ONLY answer workout, gym, fitness, health, diet, and nutrition questions. For ANY non-fitness/non-diet question (e.g. coding, math, general trivia, movies, politics), output ONLY the exact refusal message:
"${OFF_TOPIC_REFUSAL}"
2. Always use Markdown formatting to make your responses visually appealing and easy to read.
3. 🚨 USE EMOJIS LIBERALLY! 🚨 Every single bullet point, heading, and paragraph should contain relevant emojis (e.g., 🔥, 💪, 🥗, 🏋️‍♂️, ⚡, 🧠, 💧, 📈).
4. Structure answers using bullet points (• or emojis) under bold headers.
5. If recommending exercises, list them as: • Exercise Name — sets x reps (rest period) — brief tip on form.
6. End every workout/diet response with a strong motivational line prefixed with 🎯.
7. Jump straight into the value. Do NOT wrap in markdown code blocks or prefix with "Coach:".`;

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
      dietDuration, dailyMeals, allergies, medicalConditions,
      sleepTime, wakeTime, cookingSkill, supplements
    } = req.body;

    const targetDays = Number(dietDuration) || 1;
    const targetMealsCount = Number(dailyMeals) || 4;

    let goalInstruction = "";
    if (goal === 'weight_loss') {
      goalInstruction = "STRICT GOAL REQUIREMENT: The user wants WEIGHT LOSS / FAT CUT. Calculate a clear caloric deficit (e.g. 1600 - 2000 kcal). Select meals that are high in protein, rich in fiber, low in sugar and refined carbs, and explicitly tailored for burning fat and weight loss.";
    } else if (goal === 'muscle_gain') {
      goalInstruction = "STRICT GOAL REQUIREMENT: The user wants MUSCLE BUILDING / BULKING. Calculate a caloric surplus (e.g. 2600 - 3200 kcal). Select meals high in protein (150g+) and high clean carbohydrates for muscle growth and recovery.";
    } else if (goal === 'maintenance') {
      goalInstruction = "STRICT GOAL REQUIREMENT: The user wants LEAN RECOMPOSITION / MAINTENANCE. Balance calories around TDEE (2000 - 2400 kcal) with high protein.";
    } else {
      goalInstruction = "STRICT GOAL REQUIREMENT: The user wants ATHLETIC ENDURANCE. Provide balanced nutrients with high complex carbs for stamina.";
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
- Target Daily Meals Count: ${targetMealsCount} meals per day
- Diet Plan Duration: EXACTLY ${targetDays} Days

${goalInstruction}

Generate a structured multi-day diet plan in EXACT JSON format. Do not include any markdown wrappers or introductory texts, only return the raw JSON matching the following structure:
{
  "dailyCalories": 2000,
  "protein": "130g",
  "carbs": "220g",
  "fat": "60g",
  "water": "3.5L",
  "dailyPlans": [
    {
      "dayNumber": 1,
      "dayName": "Day 1",
      "meals": [
        {
          "meal": "Breakfast",
          "time": "8:00 AM",
          "foods": ["Oats", "Milk", "Banana"],
          "prepTime": 10,
          "recipe": "Boil oats in milk...",
          "calories": 450,
          "protein": 18,
          "carbs": 65,
          "fat": 10
        }
      ]
    }
  ],
  "shoppingList": ["Oats", "Milk", "Bananas"]
}

CRITICAL MANDATORY RULES:
1. Generate EXACTLY ${targetDays} unique daily plans inside the "dailyPlans" array (dayNumber: 1 to ${targetDays}, dayName: "Day 1", "Day 2", etc.).
2. Each day inside "dailyPlans" MUST contain exactly ${targetMealsCount} meals (e.g. Breakfast, Lunch, Snack, Dinner).
3. Adjust calories and macros strictly according to the fitness goal (${goal}).`;

    const textResponse = await generateWithFallback(systemPrompt);
    const parsedPlan = cleanAndParseJSON(textResponse);

    if (!parsedPlan) {
      return res.status(500).json({ success: false, message: "Failed to parse AI-generated diet plan." });
    }

    // Ensure dailyPlans exists and has EXACTLY targetDays length
    if (!parsedPlan.dailyPlans || !Array.isArray(parsedPlan.dailyPlans) || parsedPlan.dailyPlans.length === 0) {
      parsedPlan.dailyPlans = [];
    }

    // If AI returned fewer days than requested, expand dailyPlans to match targetDays
    if (parsedPlan.dailyPlans.length < targetDays) {
      const baseMeals = (parsedPlan.dailyPlans[0] && parsedPlan.dailyPlans[0].meals && parsedPlan.dailyPlans[0].meals.length > 0)
        ? parsedPlan.dailyPlans[0].meals
        : (parsedPlan.meals || []);

      for (let i = parsedPlan.dailyPlans.length + 1; i <= targetDays; i++) {
        parsedPlan.dailyPlans.push({
          dayNumber: i,
          dayName: `Day ${i}`,
          meals: JSON.parse(JSON.stringify(baseMeals))
        });
      }
    } else if (parsedPlan.dailyPlans.length > targetDays) {
      parsedPlan.dailyPlans = parsedPlan.dailyPlans.slice(0, targetDays);
    }

    // Ensure top-level meals exists as fallback
    if (parsedPlan.dailyPlans.length > 0 && parsedPlan.dailyPlans[0].meals) {
      parsedPlan.meals = parsedPlan.dailyPlans[0].meals;
    }

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

    // Save or update user's plan in DB, and reset completedMealsLog for fresh plan
    let userPlan = await UserDietPlan.findOne({ userId });
    if (userPlan) {
      userPlan.dailyCalories = parsedPlan.dailyCalories;
      userPlan.protein = parsedPlan.protein;
      userPlan.carbs = parsedPlan.carbs;
      userPlan.fat = parsedPlan.fat;
      userPlan.water = parsedPlan.water;
      userPlan.goal = goal || 'general_fitness';
      userPlan.dailyPlans = parsedPlan.dailyPlans;
      userPlan.meals = parsedPlan.meals || [];
      userPlan.shoppingList = parsedPlan.shoppingList;
      userPlan.completedMealsLog = []; // Reset meal checklist for new plan
    } else {
      userPlan = new UserDietPlan({
        userId,
        dailyCalories: parsedPlan.dailyCalories,
        protein: parsedPlan.protein,
        carbs: parsedPlan.carbs,
        fat: parsedPlan.fat,
        water: parsedPlan.water,
        goal: goal || 'general_fitness',
        dailyPlans: parsedPlan.dailyPlans,
        meals: parsedPlan.meals || [],
        shoppingList: parsedPlan.shoppingList,
        completedMealsLog: []
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
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required." });
    }
    const userId = req.user._id;

    if (isOffTopicQuery(message)) {
      return res.json({ success: true, reply: OFF_TOPIC_REFUSAL });
    }

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

CRITICAL MANDATORY DOMAIN RESTRICTION RULE:
You are EXCLUSIVELY an AI Diet, Nutrition, and Fitness Coach. You MUST ONLY answer questions directly related to nutrition, diet, food, meals, recipes, macros, calories, supplements, hydration, workouts, and health.
IF THE USER'S QUESTION IS NOT RELATED TO DIET, NUTRITION, FOOD, HEALTH, FITNESS, OR WORKOUTS (e.g. coding, math, general trivia, movies, politics):
YOU MUST REFUSE TO ANSWER.
Respond EXACTLY with:
"${OFF_TOPIC_REFUSAL}"

Guidelines for diet/fitness questions:
1. Address the user's diet request. If they want to swap a food (e.g. "I don't like broccoli"), suggest a healthy alternative with similar macros (e.g. spinach or asparagus) and tell them exactly how it fits.
2. Keep responses brief, practical, and highly motivating (under 3 paragraphs).
3. If they ask you to modify their active plan, describe the changes clearly.

New User Message: "${message}"

Respond directly and concisely. Do not wrap in markdown code blocks.`;

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
