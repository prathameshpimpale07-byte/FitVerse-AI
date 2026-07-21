require('dotenv').config();
const mongoose = require('mongoose');
const https = require('https');
const Exercise = require('./models/Exercise');
const Workout = require('./models/Workout');

function fetchFreeDb() {
  return new Promise((resolve, reject) => {
    https.get('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

// Simple Levenshtein distance or word match
function getBestMatch(name, freeDb) {
  const lowerName = name.toLowerCase().replace(/[-]/g, ' ');
  const words = lowerName.split(' ');
  
  let bestMatch = null;
  let maxScore = -1;

  for (const ex of freeDb) {
    const exName = ex.name.toLowerCase().replace(/[-]/g, ' ');
    if (exName === lowerName) return ex; // Exact match
    
    let score = 0;
    for (const w of words) {
      if (exName.includes(w)) score++;
    }
    
    // Penalize if the length is too different
    if (score > 0) {
      score -= Math.abs(exName.length - lowerName.length) * 0.01;
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = ex;
    }
  }

  // Only return if score is decent (at least 1 full word match)
  return maxScore >= 0.5 ? bestMatch : null;
}

const fallbackImages = {
  chest: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
  back: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop',
  legs: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop',
  shoulders: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
  biceps: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=800&auto=format&fit=crop',
  triceps: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
  abs: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
  cardio: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop'
};

const workoutImages = {
  'full body': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop',
  'chest': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop',
  'leg': 'https://images.unsplash.com/photo-1434596922112-19c563067271?q=80&w=1000&auto=format&fit=crop',
  'back': 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?q=80&w=1000&auto=format&fit=crop',
  'core': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop',
  'cardio': 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1000&auto=format&fit=crop',
  'strength': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop'
};

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    console.log('Fetching free-exercise-db...');
    const freeDb = await fetchFreeDb();
    console.log(`Fetched ${freeDb.length} exercises from free-exercise-db`);

    // 1. UPDATE EXERCISES
    const exercises = await Exercise.find();
    let exUpdated = 0;
    
    for (const ex of exercises) {
      const match = getBestMatch(ex.exerciseName, freeDb);
      if (match) {
        // Use proper image from the DB repo!
        // The repo structure is: exercises/id/0.jpg
        const newImageUrl = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${match.id}/0.jpg`;
        ex.imageUrl = newImageUrl;
      } else {
        // Fallback
        ex.imageUrl = fallbackImages[ex.targetMuscle] || fallbackImages.chest;
      }
      
      // Some exercises might have GIFs as videoUrl. We can leave videoUrl as is.
      await ex.save();
      exUpdated++;
    }
    console.log(`Updated ${exUpdated} Exercises with REAL images!`);

    // 2. UPDATE WORKOUT CARDS ("bahar bhi jo workout hai vahi image dalao")
    const workouts = await Workout.find();
    let woUpdated = 0;

    for (const wo of workouts) {
      let matchedImg = workoutImages.strength; // Default
      const lowerName = wo.workoutName.toLowerCase();
      
      for (const [key, img] of Object.entries(workoutImages)) {
        if (lowerName.includes(key)) {
          matchedImg = img;
          break;
        }
      }
      
      wo.image = matchedImg;
      await wo.save();
      woUpdated++;
    }
    console.log(`Updated ${woUpdated} Workout Cards!`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
