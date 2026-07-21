const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const KnowledgeBase = require('../models/KnowledgeBase');

dotenv.config({ path: path.join(__dirname, '../.env') });

const knowledgeArticles = [
  {
    title: 'Bench Press Technique & Shoulder Safety',
    category: 'Workout',
    tags: ['chest', 'bench press', 'shoulder pain', 'form', 'barbell'],
    summary: 'Optimal bench press setup to maximize chest hypertrophy while protecting the rotator cuff.',
    content: `
- **Scapular Retraction:** Always pull your shoulder blades together and down into the bench ('pack your shoulders') to lock the rotator cuff into a safe position.
- **Grip Width:** Place hands 1.5x shoulder-width apart. Flare elbows at a 45-degree angle to your torso, NOT a 90-degree flare which causes impingement.
- **Bar Path:** Lower the bar gently to your mid-sternum / lower chest, then press back up in a slight diagonal arc toward your eyes.
- **Leg Drive:** Drive your heels into the floor throughout the movement to stabilize your pelvis and maintain a natural lumbar arch.
    `.trim(),
    source: 'FitVerse Biomechanics Lab'
  },
  {
    title: 'Knee Pain & Squat Modifications',
    category: 'Injury',
    tags: ['knee pain', 'squats', 'quads', 'patellar tendonitis', 'joint safety'],
    summary: 'Adjustments for athletes experiencing anterior knee discomfort during lower body training.',
    content: `
- **Box Squats:** Squatting down to a 16-inch box reduces patellar shear stress by keeping the shins vertical and shifting load to the hamstrings & glutes.
- **Spanish Squats & Wall Sits:** Isometric 45-second holds at 90-degree knee flexion stimulate patellar tendon analgesia (pain reduction).
- **Quad vs Hamstring Balance:** Incorporate Romanian Deadlifts (RDLs) and Seated Hamstring Curls at a 1:1 ratio with quad exercises to stabilize the knee joint.
- **Avoid:** High-impact plyometrics or deep leg presses with heels lifting off the footplate until knee inflammation subsides.
    `.trim(),
    source: 'FitVerse Physical Therapy Guide'
  },
  {
    title: 'High-Protein Vegetarian Meal Planning (Indian Context)',
    category: 'Diet',
    tags: ['nutrition', 'vegetarian', 'high protein', 'indian diet', 'macros', 'paneer', 'tofu', 'dal'],
    summary: 'Achieving 120g-160g daily protein on a lacto-vegetarian or vegan Indian diet.',
    content: `
- **Top Protein Sources:** 
  1. Low-Fat Paneer (18g protein per 100g)
  2. Soya Chunks (52g protein per 100g dry) - Soak in warm salted water & squeeze before cooking.
  3. Tofu / Soy Paneer (15g protein per 100g)
  4. Greek Yogurt / Hung Curd (10g protein per 100g)
  5. Sattu Powder (20g protein per 100g) - Mix with cold water, cumin, and lemon for a quick intra-day shake.
- **Amino Acid Complete Pairing:** Always pair legumes (Lentils/Dals) with whole grains (Brown Rice/Millets) in a 2:1 ratio to complete the essential amino acid profile (Methionine + Lysine).
    `.trim(),
    source: 'FitVerse Nutrition Advisory'
  },
  {
    title: 'Fat Loss Physiology: Caloric Deficit & NEAT',
    category: 'Diet',
    tags: ['fat loss', 'caloric deficit', 'neat', 'metabolism', 'cardio', 'weight loss'],
    summary: 'Science-backed approach to sustainable fat loss without muscle wasting.',
    content: `
- **Optimal Deficit:** Aim for a 300-500 kcal daily deficit below TDEE (Total Daily Energy Expenditure) to lose 0.5kg per week safely.
- **Protein Sparing:** Consume 1.8g - 2.2g of protein per kg of total bodyweight to prevent lean muscle tissue breakdown during a deficit.
- **NEAT (Non-Exercise Activity Thermogenesis):** Daily steps (8,000 - 10,000 steps) burn more total daily calories than a 45-minute HIIT session. Keep moving throughout the day.
- **Refeed Days:** Every 14 days of continuous deficit, increase carbohydrate intake to maintenance levels for 24-48 hours to restore leptin and thyroid hormones (T3).
    `.trim(),
    source: 'FitVerse Sports Physiology'
  },
  {
    title: 'Creatine Monohydrate Dosage & Loading Protocol',
    category: 'Supplement',
    tags: ['creatine', 'supplements', 'muscle growth', 'strength', 'ATP'],
    summary: 'How to properly supplement Creatine Monohydrate for ATP regeneration and power output.',
    content: `
- **Mechanism:** Increases intramuscular phosphocreatine stores, replenishing ATP rapidly during heavy compound lifts (1-6 rep range).
- **Dosage:** 3g to 5g taken daily at any time (consistency matters more than timing). Loading phase (20g/day for 5 days) is optional but accelerates saturation.
- **Hydration:** Consume an additional 500ml-750ml of water daily as creatine draws water into muscle cells (intracellular hydration, which increases muscle fullness).
- **Safety:** Micronized Creatine Monohydrate is the most thoroughly researched sports supplement in history with zero adverse renal effects in healthy individuals.
    `.trim(),
    source: 'FitVerse Supplement Science'
  },
  {
    title: 'Hypertrophy Principles: RIR, Volume, & Progressive Overload',
    category: 'Workout',
    tags: ['hypertrophy', 'muscle building', 'rir', 'volume', 'progressive overload', 'sets'],
    summary: 'Core rules for maximizing skeletal muscle hypertrophy.',
    content: `
- **Progressive Overload:** Increase weight, add reps, or improve execution control (eccentric tempo) each week.
- **Proximity to Failure (RIR):** Train most working sets to 1-3 Reps in Reserve (RIR 1-3). The last 3-4 reps before failure produce the highest mechanical tension.
- **Weekly Volume:** 10 to 20 hard working sets per muscle group per week split across 2-3 training sessions.
- **Rest Intervals:** Rest 2-3 minutes between heavy compound lifts (Squats, Deadlifts, Bench) to allow full ATP resynthesis.
    `.trim(),
    source: 'FitVerse Exercise Science'
  }
];

const seedKnowledgeBase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitverse';
    await mongoose.connect(mongoUri);
    console.log('🌱 Connected to MongoDB for RAG Seeding...');

    // Clear existing knowledge entries and insert fresh ones
    await KnowledgeBase.deleteMany({});
    const inserted = await KnowledgeBase.insertMany(knowledgeArticles);
    console.log(`✅ Successfully seeded ${inserted.length} RAG Knowledge Base articles!`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ RAG Seeding failed:', error);
    process.exit(1);
  }
};

seedKnowledgeBase();
