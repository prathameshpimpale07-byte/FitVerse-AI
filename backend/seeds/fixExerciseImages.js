require('dotenv').config();
const mongoose = require('mongoose');
const Exercise = require('./models/Exercise');

const imageMap = {
  // Chest
  'bench press': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
  'incline': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
  'decline': 'https://images.unsplash.com/photo-1507398941214-5a10cb23194a?q=80&w=800&auto=format&fit=crop',
  'push-up': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop',
  'push up': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop',
  'cable crossover': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop',
  'fly': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
  'pec deck': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
  'pullover': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
  
  // Back
  'pull-up': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop',
  'pull up': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop',
  'lat pulldown': 'https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=800&auto=format&fit=crop',
  'barbell row': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
  'dumbbell row': 'https://images.unsplash.com/photo-1507398941214-5a10cb23194a?q=80&w=800&auto=format&fit=crop',
  't-bar row': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
  'deadlift': 'https://images.unsplash.com/photo-1526506114620-1175653dbfbf?q=80&w=800&auto=format&fit=crop',
  'face pull': 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?q=80&w=800&auto=format&fit=crop',
  'shrug': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',

  // Legs
  'squat': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop',
  'leg press': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
  'lunge': 'https://images.unsplash.com/photo-1434596922112-19c563067271?q=80&w=800&auto=format&fit=crop',
  'leg extension': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
  'leg curl': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop',
  'calf raise': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
  'romanian deadlift': 'https://images.unsplash.com/photo-1526506114620-1175653dbfbf?q=80&w=800&auto=format&fit=crop',
  'glute bridge': 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?q=80&w=800&auto=format&fit=crop',
  
  // Shoulders
  'shoulder press': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
  'overhead press': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
  'lateral raise': 'https://images.unsplash.com/photo-1507398941214-5a10cb23194a?q=80&w=800&auto=format&fit=crop',
  'front raise': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
  'rear delt': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop',
  'upright row': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
  
  // Biceps
  'bicep curl': 'https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=800&auto=format&fit=crop',
  'hammer curl': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
  'preacher curl': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
  'concentration curl': 'https://images.unsplash.com/photo-1507398941214-5a10cb23194a?q=80&w=800&auto=format&fit=crop',
  
  // Triceps
  'tricep extension': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
  'tricep dip': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
  'skull crusher': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop',
  'tricep pushdown': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
  'kickback': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop',

  // Core / Abs
  'crunch': 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?q=80&w=800&auto=format&fit=crop',
  'plank': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
  'leg raise': 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?q=80&w=800&auto=format&fit=crop',
  'russian twist': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
  'ab wheel': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',

  // Cardio
  'running': 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop',
  'cycling': 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=800&auto=format&fit=crop',
  'jump rope': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop',
  'burpee': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop',
  'rowing': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
  'treadmill': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop'
};

const fallbacks = {
  chest: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
  back: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop',
  legs: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop',
  shoulders: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
  biceps: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=800&auto=format&fit=crop',
  triceps: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
  abs: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
  core: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
  cardio: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop',
  'full body': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop'
};

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const exercises = await Exercise.find();
    let updated = 0;

    for (let ex of exercises) {
      let newImage = null;
      const lowerName = ex.exerciseName.toLowerCase();

      // Check specific mappings
      for (const [key, url] of Object.entries(imageMap)) {
        if (lowerName.includes(key)) {
          newImage = url;
          break;
        }
      }

      // Fallback to category
      if (!newImage) {
        newImage = fallbacks[ex.targetMuscle] || fallbacks['full body'];
      }

      ex.imageUrl = newImage;
      await ex.save();
      updated++;
    }

    console.log(`Successfully updated images for ${updated} exercises!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
