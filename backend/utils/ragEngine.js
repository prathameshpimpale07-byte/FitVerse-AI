const KnowledgeBase = require('../models/KnowledgeBase');
const User = require('../models/User');
const Progress = require('../models/Progress');
const WorkoutHistory = require('../models/WorkoutHistory');

/**
 * FitVerse RAG Engine
 * Retrieves relevant scientific knowledge articles & user profile/activity context
 * to build an augmented, hyper-personalized prompt for Gemini AI.
 */
const retrieveKnowledgeAndContext = async (userId, userQuery) => {
  try {
    // 1. Keyword extraction & Semantic matching
    const cleanQuery = userQuery.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const queryWords = cleanQuery.split(/\s+/).filter(w => w.length > 2);

    // Search KnowledgeBase by text index or tag regex matching
    let retrievedDocs = [];
    if (queryWords.length > 0) {
      const regexPattern = queryWords.join('|');
      try {
        retrievedDocs = await KnowledgeBase.find({ $text: { $search: cleanQuery } }).limit(3).lean();
      } catch (err) {
        retrievedDocs = [];
      }

      if (!retrievedDocs || retrievedDocs.length === 0) {
        retrievedDocs = await KnowledgeBase.find({
          $or: [
            { tags: { $in: queryWords } },
            { title: { $regex: regexPattern, $options: 'i' } },
            { content: { $regex: regexPattern, $options: 'i' } },
          ]
        })
        .limit(3)
        .lean();
      }
    }

    // Fallback if no specific doc matched: grab top general articles
    if (!retrievedDocs || retrievedDocs.length === 0) {
      retrievedDocs = await KnowledgeBase.find({}).limit(2).lean();
    }

    // 2. Fetch User Profile & Recent History Context
    let userContextStr = 'No specific user profile provided.';
    if (userId) {
      const user = await User.findById(userId).lean();
      const latestProgress = await Progress.findOne({ user: userId }).sort({ createdAt: -1 }).lean();
      const recentWorkouts = await WorkoutHistory.find({ user: userId }).sort({ createdAt: -1 }).limit(3).lean();

      if (user) {
        userContextStr = `
- Name: ${user.name}
- Fitness Goal: ${user.fitnessGoal || 'General Fitness'}
- Age: ${user.age || 'Not specified'}, Gender: ${user.gender || 'Not specified'}
- Height: ${user.height ? `${user.height} cm` : 'Not specified'}, Weight: ${user.weight ? `${user.weight} kg` : 'Not specified'}
- Recent Calories Burned: ${latestProgress?.caloriesBurned || 0} kcal
- Recent Workouts Completed: ${recentWorkouts.map(w => w.title || 'Workout').join(', ') || 'None logged recently'}
        `.trim();
      }
    }

    // 3. Build Formatted Knowledge String
    const knowledgeText = retrievedDocs
      .map(doc => `--- ARTICLE: ${doc.title} (${doc.category}) ---\nSource: ${doc.source}\n${doc.content}`)
      .join('\n\n');

    // 4. Construct RAG Augmented Prompt
    const augmentedPrompt = `
You are the **FitVerse AI Master Fitness & Nutrition Coach**, an elite, evidence-based fitness AI.
You have access to the verified FitVerse Knowledge Base and the user's real-time profile.

==================================================
1. USER PROFILE & CONTEXT:
${userContextStr}

==================================================
2. RETRIEVED KNOWLEDGE BASE EVIDENCE (RAG CONTEXT):
${knowledgeText}

==================================================
3. USER QUESTION:
"${userQuery}"

==================================================
CRITICAL DOMAIN RESTRICTION RULE (STRICT MANDATE):
You are EXCLUSIVELY a Fitness, Workout, Gym, Health, and Nutrition/Diet Coach. You MUST ONLY answer questions directly related to workouts, exercise form, gym equipment, routines, splits, cardio, strength training, flexibility, mobility, nutrition, diet plans, macros, calories, food, hydration, supplements, recovery, sleep for fitness, or physical health goals.

IF THE USER QUESTION IS NOT DIRECTLY RELATED TO WORKOUTS, FITNESS, GYM, HEALTH, DIET, OR NUTRITION (for example: programming/code, math, general trivia, movies, politics, history, non-fitness jokes, general non-fitness questions):
YOU MUST REFUSE TO ANSWER THE OFF-TOPIC QUESTION.
Respond EXACTLY with:
"⚠️ **Scope Constraint**: I am your dedicated FitVerse AI Fitness & Nutrition Coach. I can only assist with workout routines, exercise form, gym training, diet plans, nutrition, health, and fitness goals. Please ask me a fitness or diet-related question! 💪🥗"

==================================================
INSTRUCTIONS FOR FITVERSE AI (FOR FITNESS/DIET QUESTIONS):
- Answer the user's question directly, concisely, accurately, and encouragingly.
- Incorporate evidence from the [RETRIEVED KNOWLEDGE BASE EVIDENCE] above wherever relevant.
- Tailor suggestions to the user's specific fitness goal and body metrics if available.
- Use clean Markdown formatting (bolding, bullet points, numbered steps) so the output is beautiful and easy to read.
    `.trim();

    return {
      augmentedPrompt,
      retrievedDocs: retrievedDocs.map(d => ({ title: d.title, category: d.category, source: d.source })),
    };
  } catch (error) {
    console.error('RAG Retrieval error:', error);
    return {
      augmentedPrompt: `User Question: "${userQuery}". Answer concisely as an elite fitness coach using clean markdown formatting.`,
      retrievedDocs: [],
    };
  }
};

module.exports = { retrieveKnowledgeAndContext };
