const Exercise = require('../models/Exercise');

exports.getExercises = async (req, res) => {
  try {
    const { category, search, difficulty } = req.query;
    let query = {};
    
    if (category && category !== 'all') {
      query.targetMuscle = category.toLowerCase();
    }
    
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }
    
    if (search) {
      query.exerciseName = { $regex: search, $options: 'i' };
    }
    
    const exercises = await Exercise.find(query).sort({ exerciseName: 1 });
    res.json({ success: true, count: exercises.length, exercises });
  } catch (error) {
    console.error("Fetch Exercises Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching exercises." });
  }
};

exports.getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ success: false, message: "Exercise not found" });
    }
    res.json({ success: true, exercise });
  } catch (error) {
    console.error("Fetch Exercise By ID Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching exercise." });
  }
};

exports.seedExercises = async (req, res) => {
  try {
    const seedData = [
      // ==================== CHEST (10) ====================
      {
        exerciseName: 'Barbell Bench Press', targetMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'],
        equipment: 'Barbell, Flat Bench', difficulty: 'Intermediate', estimatedCalories: 120, estimatedDuration: 10,
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg',
        instructions: [
          'Lie flat on the bench with your feet flat on the floor for stability.',
          'Grip the barbell with hands slightly wider than shoulder-width.',
          'Brace your core, unrack the bar, and position it directly over your chest.',
          'Lower the bar slowly under control to your mid-chest line.',
          'Press the bar explosively back up until your arms are fully extended.'
        ],
        tips: ['Keep your feet flat on the floor', 'Maintain a slight arch in your lower back', 'Squeeze your shoulder blades together'],
        commonMistakes: ['Bouncing the bar off your chest', 'Flaring elbows out too wide', 'Lifting hips off the bench']
      },
      {
        exerciseName: 'Incline Dumbbell Press', targetMuscle: 'chest', secondaryMuscles: ['shoulders', 'triceps'],
        equipment: 'Dumbbells, Incline Bench', difficulty: 'Intermediate', estimatedCalories: 110, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/8iPntVrxvQI',
        instructions: [
          'Set an adjustable bench to an incline angle of 30 to 45 degrees.',
          'Hold a dumbbell in each hand and sit back on the bench, feet flat on the floor.',
          'Raise the dumbbells to shoulder height, palms facing forward.',
          'Press the dumbbells straight up above your chest until arms are locked out.',
          'Lower the weights slowly under control until they are level with your chest.'
        ],
        tips: ['Focus on contracting the upper chest muscles', 'Control the dumbbells on the way down'],
        commonMistakes: ['Setting the bench angle too steep (uses too much shoulder)', 'Clashing the dumbbells together at the top']
      },
      {
        exerciseName: 'Decline Barbell Press', targetMuscle: 'chest', secondaryMuscles: ['triceps'],
        equipment: 'Barbell, Decline Bench', difficulty: 'Intermediate', estimatedCalories: 110, estimatedDuration: 10,
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/LfyQBUKR8SE',
        instructions: [
          'Secure your legs under the decline bench pads and lie back.',
          'Grip the bar slightly wider than shoulder-width with an overhand grip.',
          'Unrack the barbell and lower it under control to your lower chest.',
          'Drive the barbell back up until your arms are fully extended.'
        ],
        tips: ['Keep your wrist straight and in line with your elbows', 'Use a spotter for decline movements'],
        commonMistakes: ['Lowering the bar too high up towards the neck', 'Short range of motion']
      },
      {
        exerciseName: 'Dumbbell Chest Fly', targetMuscle: 'chest', secondaryMuscles: ['shoulders'],
        equipment: 'Dumbbells, Flat Bench', difficulty: 'Beginner', estimatedCalories: 80, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/eozdVDA78K0',
        instructions: [
          'Lie flat on a flat bench holding dumbbells above you with palms facing in.',
          'Lower your arms out to the sides in a wide, circular arc.',
          'Maintain a slight bend in your elbows to protect the joints.',
          'Lower until you feel a comfortable stretch across your chest.',
          'Squeeze your chest muscles to pull the weights back to the starting position.'
        ],
        tips: ['Imagine hugging a wide tree trunk', 'Do not press the weights, fly them'],
        commonMistakes: ['Bending the elbows too much (turning it into a press)', 'Lowering the weights too far past shoulder level']
      },
      {
        exerciseName: 'Cable Crossover', targetMuscle: 'chest', secondaryMuscles: ['shoulders'],
        equipment: 'Cable Machine', difficulty: 'Intermediate', estimatedCalories: 85, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/W55S9I-dO6M',
        instructions: [
          'Set pulleys on a cable crossover station to the high position.',
          'Hold a handle in each hand, step forward between pulleys, and lean slightly forward.',
          'Extend your arms out to the sides with a slight bend in your elbows.',
          'Bring your hands forward and down in a wide arc until they cross over in front.',
          'Return slowly to the starting position under control.'
        ],
        tips: ['Squeeze the lower chest at the bottom of the movement', 'Keep your core braced for balance'],
        commonMistakes: ['Using momentum to swing the cables', 'Bending your back too much']
      },
      {
        exerciseName: 'Standard Push-ups', targetMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders', 'core'],
        equipment: 'Bodyweight', difficulty: 'Beginner', estimatedCalories: 60, estimatedDuration: 5,
        imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
        instructions: [
          'Get into a plank position with hands slightly wider than shoulder-width.',
          'Keep your body in a straight line from head to heels.',
          'Lower your body by bending your elbows until your chest nearly touches the floor.',
          'Push through your hands to return to the plank position.'
        ],
        tips: ['Keep your neck neutral looking slightly ahead', 'Squeeze your glutes to stabilize your hips'],
        commonMistakes: ['Letting hips sag toward the floor', 'Flaring elbows straight out to the sides']
      },
      {
        exerciseName: 'Chest Dips', targetMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'],
        equipment: 'Dip Bars', difficulty: 'Advanced', estimatedCalories: 100, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/2z8JmcrW-As',
        instructions: [
          'Grip the parallel dip bars and lift yourself until your arms are straight.',
          'Lean your torso forward slightly (about 15 degrees) to target the chest.',
          'Bend your knees and lower your body by bending your elbows.',
          'Go down until your shoulders are slightly below your elbows.',
          'Push back up explosively until your arms are straight.'
        ],
        tips: ['Leaning forward targets chest, staying vertical targets triceps', 'Control the descent'],
        commonMistakes: ['Shrugging shoulders near ears', 'Using legs to swing up']
      },
      {
        exerciseName: 'Pec Deck Fly', targetMuscle: 'chest', secondaryMuscles: ['shoulders'],
        equipment: 'Pec Deck Machine', difficulty: 'Beginner', estimatedCalories: 75, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/O-M1G2pnh1k',
        instructions: [
          'Sit on the pec deck machine with your back flat against the pad.',
          'Adjust seat height so handles are level with your chest.',
          'Grip handles and rest your forearms against the pads.',
          'Pull your elbows together in front of your chest, squeezing hard.',
          'Slowly return to the starting position feeling the stretch.'
        ],
        tips: ['Focus entirely on chest contraction', 'Maintain a slow, steady speed'],
        commonMistakes: ['Letting weights slam at the start', 'Moving shoulders forward off the pad']
      },
      {
        exerciseName: 'Incline Barbell Press', targetMuscle: 'chest', secondaryMuscles: ['shoulders', 'triceps'],
        equipment: 'Barbell, Incline Bench', difficulty: 'Intermediate', estimatedCalories: 115, estimatedDuration: 10,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/SrqOu550Gv8',
        instructions: [
          'Lie back on an incline bench set to a 30-45 degree angle.',
          'Grip the barbell with hands slightly wider than shoulder-width.',
          'Unrack the barbell and lower it under control to your upper chest.',
          'Push the bar straight up until your elbows lock out.'
        ],
        tips: ['Keep your wrists straight', 'Drive through your legs for power'],
        commonMistakes: ['Lowering the bar to your stomach instead of upper chest', 'Bouncing the bar']
      },
      {
        exerciseName: 'Dumbbell Pull-over', targetMuscle: 'chest', secondaryMuscles: ['lats', 'triceps'],
        equipment: 'Dumbbell, Flat Bench', difficulty: 'Intermediate', estimatedCalories: 85, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/FKg5Q4P4YkU',
        instructions: [
          'Lie perpendicular on a flat bench with only your upper back resting on the bench.',
          'Hold one dumbbell with both hands directly above your chest.',
          'Lower the dumbbell slowly in an arc behind your head.',
          'Keep a slight bend in your elbows and go until you feel a stretch.',
          'Pull the dumbbell back up in the same arc to the starting position.'
        ],
        tips: ['Keep your hips low to maximize the stretch', 'Engage your chest and lats to lift'],
        commonMistakes: ['Bending elbows too much during lift', 'Lifting hips high']
      },

      // ==================== BACK (10) ====================
      {
        exerciseName: 'Pull-ups', targetMuscle: 'back', secondaryMuscles: ['biceps', 'shoulders'],
        equipment: 'Pull-up Bar', difficulty: 'Advanced', estimatedCalories: 90, estimatedDuration: 12,
        imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
        instructions: [
          'Grab the bar with an overhand grip, slightly wider than shoulder-width.',
          'Hang with arms fully extended and core engaged.',
          'Pull your chest up toward the bar, driving your elbows down.',
          'Lower yourself slowly to the starting position.'
        ],
        tips: ['Focus on pulling with your back, not biceps', 'Control the eccentric (lowering) phase'],
        commonMistakes: ['Kicking or swinging legs (using momentum)', 'Not pulling all the way up']
      },
      {
        exerciseName: 'Barbell Row', targetMuscle: 'back', secondaryMuscles: ['biceps', 'core'],
        equipment: 'Barbell', difficulty: 'Intermediate', estimatedCalories: 130, estimatedDuration: 10,
        imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/I-qgwlpH0r8',
        instructions: [
          'Stand with feet shoulder-width apart, holding a barbell with an overhand grip.',
          'Hinge forward at the hips, keeping your back flat and chest up.',
          'Pull the barbell to your lower chest, squeezing your shoulder blades.',
          'Lower the bar slowly back to the starting position.'
        ],
        tips: ['Keep your spine neutral throughout', 'Drive your elbows back'],
        commonMistakes: ['Rounding the lower back', 'Pulling with arms rather than the upper back']
      },
      {
        exerciseName: 'Lat Pulldown', targetMuscle: 'back', secondaryMuscles: ['biceps', 'shoulders'],
        equipment: 'Cable Machine, Pulldown Bar', difficulty: 'Beginner', estimatedCalories: 90, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/CAwf7n6Luuc',
        instructions: [
          'Sit at a pulldown station and adjust the knee pad.',
          'Grab the bar with a wide overhand grip.',
          'Pull the bar down toward your upper chest while leaning back slightly.',
          'Slowly return the bar to the starting position, feeling the stretch.'
        ],
        tips: ['Keep shoulders depressed', 'Engage your lats at the bottom'],
        commonMistakes: ['Pulling the bar behind the neck', 'Using torso momentum to swing the weight']
      },
      {
        exerciseName: 'Conventional Deadlift', targetMuscle: 'back', secondaryMuscles: ['legs', 'glutes', 'hamstrings', 'core'],
        equipment: 'Barbell', difficulty: 'Advanced', estimatedCalories: 160, estimatedDuration: 12,
        imageUrl: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/op9kVnSso6Q',
        instructions: [
          'Stand with feet hip-width apart, barbell over the middle of your feet.',
          'Hinge down and grip the bar with hands shoulder-width apart.',
          'Drop your hips slightly, straighten your back, and pull your chest up.',
          'Drive through your legs to lift the bar, keeping it close to your shins.',
          'Lock out your hips and knees at the top, then lower with control.'
        ],
        tips: ['Keep the bar path completely vertical', 'Engage your core and back muscles before lifting'],
        commonMistakes: ['Rounding the back during the lift', 'Shrugging the barbell at lock out']
      },
      {
        exerciseName: 'Seated Cable Row', targetMuscle: 'back', secondaryMuscles: ['biceps', 'forearms'],
        equipment: 'Cable Machine, V-Bar', difficulty: 'Beginner', estimatedCalories: 85, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/GZBFGIv75Gs',
        instructions: [
          'Sit at a cable row station, feet on the footplates, knees slightly bent.',
          'Grip the V-bar handle and sit tall with arms extended.',
          'Pull the handle to your lower chest, squeezing your shoulder blades.',
          'Extend your arms back out slowly under control.'
        ],
        tips: ['Keep your spine upright and avoid leaning excessively', 'Lead the pull with your elbows'],
        commonMistakes: ['Swinging your back to pull the weight', 'Shrugging your shoulders up']
      },
      {
        exerciseName: 'One-Arm Dumbbell Row', targetMuscle: 'back', secondaryMuscles: ['biceps', 'shoulders'],
        equipment: 'Dumbbell, Flat Bench', difficulty: 'Beginner', estimatedCalories: 85, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dFzUjJ5c1wc',
        instructions: [
          'Place one knee and matching hand flat on a bench for support.',
          'Hold a dumbbell in your other hand, arm hanging straight down.',
          'Row the dumbbell up to your hip, keeping your elbow close to your body.',
          'Lower the dumbbell slowly to the starting position.'
        ],
        tips: ['Pull with your back, not your arm', 'Keep your back flat and neck neutral'],
        commonMistakes: ['Twisting the torso to hoist the weight', 'Rounding the shoulder forward']
      },
      {
        exerciseName: 'T-Bar Row', targetMuscle: 'back', secondaryMuscles: ['biceps', 'core'],
        equipment: 'T-Bar Row Machine / Landmine', difficulty: 'Intermediate', estimatedCalories: 120, estimatedDuration: 10,
        imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/j3Igk5qdwd4',
        instructions: [
          'Straddle the T-Bar row machine and grip the handles.',
          'Bend your knees slightly and hinge forward, keeping a flat back.',
          'Pull the handles to your chest, squeezing your back muscles.',
          'Lower the weight back down slowly under control.'
        ],
        tips: ['Keep your chest up and neck neutral', 'Drive elbows back'],
        commonMistakes: ['Standing up too straight', 'Rounding the spine']
      },
      {
        exerciseName: 'Hyperextensions', targetMuscle: 'back', secondaryMuscles: ['glutes', 'hamstrings'],
        equipment: 'Hyperextension Bench', difficulty: 'Beginner', estimatedCalories: 60, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/ph3pddpKzzw',
        instructions: [
          'Position yourself on a hyperextension bench, thighs resting on the pads.',
          'Cross your arms over your chest or place hands behind your head.',
          'Bend forward slowly at the waist, lowering your torso.',
          'Raise your torso back up until your body is in a straight line.'
        ],
        tips: ['Squeeze your glutes at the top of the movement', 'Move slowly and smoothly'],
        commonMistakes: ['Overarching (hyperextending) the back at the top', 'Using momentum']
      },
      {
        exerciseName: 'Face Pulls', targetMuscle: 'back', secondaryMuscles: ['shoulders', 'traps'],
        equipment: 'Cable Machine, Rope', difficulty: 'Beginner', estimatedCalories: 60, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/V8dZ3Py30oY',
        instructions: [
          'Set pulleys on a cable station to upper chest level with a rope.',
          'Hold the rope handles and step back until your arms are straight.',
          'Pull the rope towards your face, pulling the handles apart near your ears.',
          'Slowly return to the starting position.'
        ],
        tips: ['Keep your elbows high', 'Squeeze the rear shoulders and upper back'],
        commonMistakes: ['Pulling to the chest instead of face', 'Using too much weight']
      },
      {
        exerciseName: 'Chin-ups', targetMuscle: 'back', secondaryMuscles: ['biceps'],
        equipment: 'Pull-up Bar', difficulty: 'Intermediate', estimatedCalories: 85, estimatedDuration: 10,
        imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/mRy9m2Q9TB8',
        instructions: [
          'Grab the bar with an underhand grip (palms facing you).',
          'Hang with arms straight, pull yourself up until chin passes the bar.',
          'Lower yourself slowly to the starting position.'
        ],
        tips: ['Engage your back at the start of the pull', 'Control the descent'],
        commonMistakes: ['Kicking legs', 'Not doing full range of motion']
      },

      // ==================== SHOULDERS (10) ====================
      {
        exerciseName: 'Overhead Barbell Press', targetMuscle: 'shoulders', secondaryMuscles: ['triceps', 'core'],
        equipment: 'Barbell, Rack', difficulty: 'Intermediate', estimatedCalories: 110, estimatedDuration: 10,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/2yjwXt_zyrc',
        instructions: [
          'Rest the barbell on your front shoulders, feet shoulder-width apart.',
          'Brace your core and press the bar straight overhead.',
          'Push your head slightly forward at the top when arms lock out.',
          'Lower the bar under control back to your shoulders.'
        ],
        tips: ['Squeeze your glutes and core to stabilize your lower back', 'Keep elbows under the bar'],
        commonMistakes: ['Arching the lower back excessively', 'Bending knees to push the weight (makes it a push press)']
      },
      {
        exerciseName: 'Seated Dumbbell Press', targetMuscle: 'shoulders', secondaryMuscles: ['triceps'],
        equipment: 'Dumbbells, Bench', difficulty: 'Beginner', estimatedCalories: 95, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/qEwKCR5JCog',
        instructions: [
          'Sit on an upright bench holding dumbbells at shoulder level.',
          'Press the dumbbells straight up overhead until arms are straight.',
          'Lower the weights slowly under control back to shoulder level.'
        ],
        tips: ['Keep your back flat against the pad', 'Do not click weights at the top'],
        commonMistakes: ['Flaring elbows out too wide', 'Arching the lower back']
      },
      {
        exerciseName: 'Dumbbell Lateral Raise', targetMuscle: 'shoulders', secondaryMuscles: ['traps'],
        equipment: 'Dumbbells', difficulty: 'Beginner', estimatedCalories: 70, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/3VcKaXtwyiv',
        instructions: [
          'Stand holding dumbbells at your sides, palms facing in.',
          'Raise your arms out to the sides with a slight bend in your elbows.',
          'Stop when your arms are parallel to the floor, palms facing down.',
          'Slowly lower the dumbbells back to the starting position.'
        ],
        tips: ['Lead with your elbows', 'Keep your shoulders down and neck relaxed'],
        commonMistakes: ['Swinging the body', 'Lifting arms too high above shoulders']
      },
      {
        exerciseName: 'Front Dumbbell Raise', targetMuscle: 'shoulders', secondaryMuscles: ['chest'],
        equipment: 'Dumbbells', difficulty: 'Beginner', estimatedCalories: 70, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/hRJ61C974sA',
        instructions: [
          'Stand with dumbbells in front of your thighs, palms facing you.',
          'Raise one arm straight out in front to shoulder height.',
          'Lower it slowly and repeat with the other arm.'
        ],
        tips: ['Control the movement on the way down', 'Keep core tight'],
        commonMistakes: ['Swinging the hips to lift', 'Locking the elbows']
      },
      {
        exerciseName: 'Reverse Pec Deck Fly', targetMuscle: 'shoulders', secondaryMuscles: ['upper back'],
        equipment: 'Pec Deck Machine', difficulty: 'Beginner', estimatedCalories: 75, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/3z5G0FmZJNs',
        instructions: [
          'Sit facing the pec deck machine pad.',
          'Grip the handles with your arms extended forward.',
          'Pull your arms backward in a wide arc, squeezing rear delts.',
          'Slowly return to the start.'
        ],
        tips: ['Keep your chest against the pad', 'Exhale on the pull'],
        commonMistakes: ['Shrugging your shoulders up', 'Letting weights slam']
      },
      {
        exerciseName: 'Arnold Press', targetMuscle: 'shoulders', secondaryMuscles: ['triceps'],
        equipment: 'Dumbbells, Bench', difficulty: 'Intermediate', estimatedCalories: 100, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/6PG7rUEs6K4',
        instructions: [
          'Sit on a bench holding dumbbells at chest level, palms facing you.',
          'Press the dumbbells up while rotating your palms outward.',
          'At the top, palms should face forward. Lower while rotating palms back.'
        ],
        tips: ['Use a smooth rotation throughout the press', 'Maintain an upright spine'],
        commonMistakes: ['Rushing the rotation', 'Lowering below chest height']
      },
      {
        exerciseName: 'Upright Row', targetMuscle: 'shoulders', secondaryMuscles: ['traps'],
        equipment: 'Barbell or Cables', difficulty: 'Intermediate', estimatedCalories: 85, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/amCU-ziHITM',
        instructions: [
          'Stand holding a barbell in front of your thighs, hands shoulder-width.',
          'Pull the bar straight up to chest height, keeping it close to your body.',
          'Elbows should point up and out. Lower the bar with control.'
        ],
        tips: ['Lead with your elbows', 'Do not pull the bar too high (shoulder impingement)'],
        commonMistakes: ['Swinging to lift', 'Elbows lower than hands']
      },
      {
        exerciseName: 'Dumbbell Shrugs', targetMuscle: 'shoulders', secondaryMuscles: ['traps'],
        equipment: 'Dumbbells', difficulty: 'Beginner', estimatedCalories: 60, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/cJRVVxMYtaM',
        instructions: [
          'Stand holding dumbbells at your sides, arms straight.',
          'Lift your shoulders as high as possible toward your ears.',
          'Squeeze traps at the top, then lower under control.'
        ],
        tips: ['Pull straight up, do not roll your shoulders', 'Hold contraction at the top for 1s'],
        commonMistakes: ['Rolling shoulders', 'Bending elbows']
      },
      {
        exerciseName: 'Cable Lateral Raise', targetMuscle: 'shoulders', secondaryMuscles: ['traps'],
        equipment: 'Cable Machine', difficulty: 'Intermediate', estimatedCalories: 75, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/PPrzYB3ycT0',
        instructions: [
          'Stand sideways to a low pulley cable machine.',
          'Grip the cable handle with the outer hand across your body.',
          'Raise your arm up and out to the side until parallel to the floor.',
          'Lower slowly under control.'
        ],
        tips: ['Maintain constant tension from cable', 'Keep a slight bend in your elbow'],
        commonMistakes: ['Leaning too far sideways', 'Using torso swing']
      },
      {
        exerciseName: 'Bent-Over Rear Delt Raise', targetMuscle: 'shoulders', secondaryMuscles: ['upper back'],
        equipment: 'Dumbbells', difficulty: 'Beginner', estimatedCalories: 70, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/ttvfGg9d76c',
        instructions: [
          'Hinge forward at the hips, keeping your back flat.',
          'Hold dumbbells hanging down beneath your chest.',
          'Raise your arms out to the sides, squeezing your rear delts.',
          'Lower slowly back to start.'
        ],
        tips: ['Keep wrists straight', 'Focus on rear shoulders'],
        commonMistakes: ['Rounding the spine', 'Swinging dumbbells']
      },

      // ==================== BICEPS (10) ====================
      {
        exerciseName: 'Barbell Bicep Curl', targetMuscle: 'biceps', secondaryMuscles: ['forearms'],
        equipment: 'Barbell', difficulty: 'Beginner', estimatedCalories: 75, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/q7rlSRFnQ9k',
        instructions: [
          'Stand tall holding a barbell with an underhand grip.',
          'Keep your elbows tucked close to your torso.',
          'Curl the bar up toward your shoulders, contracting your biceps.',
          'Slowly lower the bar back to starting position.'
        ],
        tips: ['Keep your wrists straight', 'Do not swing your back'],
        commonMistakes: ['Using hips to swing the bar up', 'Moving elbows forward during the curl']
      },
      {
        exerciseName: 'Incline Dumbbell Curl', targetMuscle: 'biceps', secondaryMuscles: ['forearms'],
        equipment: 'Dumbbells, Incline Bench', difficulty: 'Intermediate', estimatedCalories: 70, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/soxrZlIl35U',
        instructions: [
          'Sit back on an incline bench holding dumbbells.',
          'Let your arms hang straight down behind your shoulders.',
          'Keep elbows pinned back and curl the weights up.',
          'Lower slowly under control.'
        ],
        tips: ['Keep elbows behind your torso for maximum stretch', 'Squeeze biceps at the top'],
        commonMistakes: ['Letting elbows move forward', 'Rushing the movement']
      },
      {
        exerciseName: 'Hammer Curl', targetMuscle: 'biceps', secondaryMuscles: ['forearms'],
        equipment: 'Dumbbells', difficulty: 'Beginner', estimatedCalories: 70, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/zC3nLlEvin4',
        instructions: [
          'Stand holding dumbbells with a neutral grip (palms facing each other).',
          'Curl the weights up while keeping your elbows stationary.',
          'Squeeze your biceps at the top and lower under control.'
        ],
        tips: ['Keep your chest up and shoulders back', 'Control the eccentric phase'],
        commonMistakes: ['Swinging dumbbells', 'Flaring elbows']
      },
      {
        exerciseName: 'Concentration Curl', targetMuscle: 'biceps', secondaryMuscles: ['forearms'],
        equipment: 'Dumbbell, Bench', difficulty: 'Beginner', estimatedCalories: 60, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/Jvj_ALaeQ50',
        instructions: [
          'Sit on a bench, rest your elbow against your inner thigh.',
          'Hold dumbbell in your hand with arm extended.',
          'Curl the dumbbell up, contracting your bicep.',
          'Lower slowly back to start.'
        ],
        tips: ['Do not use body swing', 'Squeeze bicep at peak'],
        commonMistakes: ['Moving the supporting leg', 'Pulling elbow off the thigh']
      },
      {
        exerciseName: 'EZ Bar Preacher Curl', targetMuscle: 'biceps', secondaryMuscles: ['forearms'],
        equipment: 'EZ Bar, Preacher Bench', difficulty: 'Intermediate', estimatedCalories: 80, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/fIWP-FRFNU0',
        instructions: [
          'Sit at preacher bench, arms resting flat against the pad.',
          'Grip the EZ bar underhand.',
          'Curl the bar up until forearms are vertical.',
          'Lower bar slowly until arms are fully extended.'
        ],
        tips: ['Keep your armpits pressed into the pad', 'Do not lift elbows'],
        commonMistakes: ['Stopping short of full extension', 'Using hips to heave']
      },
      {
        exerciseName: 'Cable Bicep Curl', targetMuscle: 'biceps', secondaryMuscles: ['forearms'],
        equipment: 'Cable Machine', difficulty: 'Beginner', estimatedCalories: 75, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/AsAVbBUpM1U',
        instructions: [
          'Attach a straight bar to low pulley cable station.',
          'Stand facing pulley holding bar with underhand grip.',
          'Curl the bar up, keeping elbows pinned.',
          'Lower under control.'
        ],
        tips: ['Maintain constant cable tension', 'Squeeze biceps at the top'],
        commonMistakes: ['Leaning back', 'Moving elbows forward']
      },
      {
        exerciseName: 'Spider Curl', targetMuscle: 'biceps', secondaryMuscles: ['forearms'],
        equipment: 'Barbell, Incline Bench', difficulty: 'Intermediate', estimatedCalories: 80, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/K81hyM_L9wM',
        instructions: [
          'Lie face down on a bench set to 45 degree incline.',
          'Hold a barbell with arms hanging straight down.',
          'Curl the bar up towards your shoulders.',
          'Lower slowly back to start.'
        ],
        tips: ['Keep upper arms vertical throughout', 'Focus on peak contraction'],
        commonMistakes: ['Swinging arms', 'Lifting upper chest off the bench']
      },
      {
        exerciseName: 'Zottman Curl', targetMuscle: 'biceps', secondaryMuscles: ['forearms'],
        equipment: 'Dumbbells', difficulty: 'Intermediate', estimatedCalories: 75, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/ZrpRBgSwpHc',
        instructions: [
          'Stand holding dumbbells underhand. Curl them up to shoulders.',
          'At top, rotate wrists so palms face forward.',
          'Lower dumbbells slowly using overhand grip. Rotate back at bottom.'
        ],
        tips: ['Excellent for bicep and forearm growth', 'Control the rotation and descent'],
        commonMistakes: ['Rushing wrists rotation', 'Swinging weights']
      },
      {
        exerciseName: 'Chin-ups (Bicep Focus)', targetMuscle: 'biceps', secondaryMuscles: ['back'],
        equipment: 'Pull-up Bar', difficulty: 'Intermediate', estimatedCalories: 90, estimatedDuration: 10,
        imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/XqeeQCN1daI',
        instructions: [
          'Grab bar underhand, hands closer than shoulder-width.',
          'Hang straight, pull chest up focusing on biceps contraction.',
          'Lower slowly under control.'
        ],
        tips: ['Drive elbows down', 'Do not swing legs'],
        commonMistakes: ['Using momentum', 'Stopping short of full extension']
      },
      {
        exerciseName: 'Overhead Cable Curl', targetMuscle: 'biceps', secondaryMuscles: ['forearms'],
        equipment: 'Cable Machine', difficulty: 'Intermediate', estimatedCalories: 70, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/1vRzLpZ4Nsc',
        instructions: [
          'Stand between high pulleys holding handles, arms extended.',
          'Curl wrists towards your head, keeping upper arms parallel to floor.',
          'Extend arms slowly back to start.'
        ],
        tips: ['Keep upper arms stationary', 'Squeeze biceps peak'],
        commonMistakes: ['Dropping elbows', 'Using body swing']
      },

      // ==================== TRICEPS (10) ====================
      {
        exerciseName: 'Tricep Rope Pushdown', targetMuscle: 'triceps', secondaryMuscles: ['shoulders'],
        equipment: 'Cable Machine, Rope Attachment', difficulty: 'Beginner', estimatedCalories: 70, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/vB5OHsJ3EME',
        instructions: [
          'Face a high cable machine and grab the rope with palms facing each other.',
          'Pin your elbows to your sides and lean forward slightly.',
          'Extend your arms downward, parting the rope at the bottom.',
          'Squeeze your triceps and return slowly to starting position.'
        ],
        tips: ['Focus on locking out the elbows at the bottom', 'Keep your upper arms locked in place'],
        commonMistakes: ['Letting elbows float forward', 'Using chest/bodyweight to press down']
      },
      {
        exerciseName: 'Overhead Tricep Extension', targetMuscle: 'triceps', secondaryMuscles: ['core'],
        equipment: 'Dumbbell', difficulty: 'Beginner', estimatedCalories: 65, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/nRiJVZDpdL0',
        instructions: [
          'Sit or stand holding a dumbbell with both hands overhead.',
          'Lower the weight slowly behind your head, bending only at the elbows.',
          'Press the weight back up until your arms are fully extended.'
        ],
        tips: ['Keep your elbows close to your head', 'Do not arch your back'],
        commonMistakes: ['Flaring elbows wide', 'Allowing lower back to arch excessively']
      },
      {
        exerciseName: 'Lying Tricep Extension', targetMuscle: 'triceps', secondaryMuscles: ['shoulders'],
        equipment: 'EZ Bar, Flat Bench', difficulty: 'Intermediate', estimatedCalories: 85, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/d_KZxkY_0cM',
        instructions: [
          'Lie flat on a bench holding an EZ bar over your chest.',
          'Bend elbows to lower the bar slowly towards your forehead or behind.',
          'Press the bar back up to start.'
        ],
        tips: ['Keep upper arms stationary and vertical', 'Focus on stretching the triceps'],
        commonMistakes: ['Moving the shoulders', 'Slamming the bar into forehead']
      },
      {
        exerciseName: 'Tricep Parallel Bar Dips', targetMuscle: 'triceps', secondaryMuscles: ['chest', 'shoulders'],
        equipment: 'Dip Station', difficulty: 'Advanced', estimatedCalories: 100, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/6kALZH559kw',
        instructions: [
          'Support yourself on parallel bars. Keep torso upright.',
          'Lower body by bending elbows. Keep elbows close to ribs.',
          'Push back up until arms are locked.'
        ],
        tips: ['Keep torso upright to focus on triceps', 'Avoid swinging legs'],
        commonMistakes: ['Leaning forward too much', 'Shrugging shoulders']
      },
      {
        exerciseName: 'Close-Grip Bench Press', targetMuscle: 'triceps', secondaryMuscles: ['chest', 'shoulders'],
        equipment: 'Barbell, Flat Bench', difficulty: 'Intermediate', estimatedCalories: 110, estimatedDuration: 10,
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/nEF0bv2FW94',
        instructions: [
          'Lie on flat bench. Grip bar with hands shoulder-width apart.',
          'Unrack and lower bar slowly to mid-chest. Keep elbows tucked.',
          'Press bar straight up to start.'
        ],
        tips: ['Keep wrists straight', 'Tuck elbows close to sides'],
        commonMistakes: ['Grip too narrow (damages wrists)', 'Flaring elbows']
      },
      {
        exerciseName: 'Dumbbell Kickbacks', targetMuscle: 'triceps', secondaryMuscles: ['shoulders'],
        equipment: 'Dumbbells', difficulty: 'Beginner', estimatedCalories: 60, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/6SS6K3l2uFU',
        instructions: [
          'Hinge forward with flat back. Keep upper arm pinned to torso.',
          'Extend forearm backward until arm is straight.',
          'Slowly return to start.'
        ],
        tips: ['Squeeze tricep at peak', 'Keep upper arm completely still'],
        commonMistakes: ['Swinging dumbbell', 'Dropping elbow']
      },
      {
        exerciseName: 'Diamond Push-ups', targetMuscle: 'triceps', secondaryMuscles: ['chest', 'shoulders'],
        equipment: 'Bodyweight', difficulty: 'Intermediate', estimatedCalories: 70, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/J0DnG1_S340',
        instructions: [
          'Get into pushup position. Touch thumbs and index fingers under chest.',
          'Lower chest to hands. Push back up.'
        ],
        tips: ['Keep core braced', 'Control descent'],
        commonMistakes: ['Sagging hips', 'Flaring elbows']
      },
      {
        exerciseName: 'V-Bar Cable Pushdown', targetMuscle: 'triceps', secondaryMuscles: ['shoulders'],
        equipment: 'Cable Machine', difficulty: 'Beginner', estimatedCalories: 70, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/2-LAMclnPaY',
        instructions: [
          'Stand facing cable pulley holding V-bar.',
          'Pin elbows to sides. Press bar down until arms are straight.',
          'Return slowly to start.'
        ],
        tips: ['Squeeze triceps at lockout', 'Maintain upright posture'],
        commonMistakes: ['Letting elbows move', 'Using bodyweight to press']
      },
      {
        exerciseName: 'Weighted Bench Dips', targetMuscle: 'triceps', secondaryMuscles: ['shoulders'],
        equipment: 'Benches', difficulty: 'Intermediate', estimatedCalories: 80, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/0326dy_-CzM',
        instructions: [
          'Place hands on edge of bench behind you. Feet on opposite bench.',
          'Lower body slowly by bending elbows. Push back up.'
        ],
        tips: ['Keep back close to bench', 'Place weight on hips if needed'],
        commonMistakes: ['Going too low (harms shoulders)', 'Flaring elbows']
      },
      {
        exerciseName: 'Cable Overhead Extension', targetMuscle: 'triceps', secondaryMuscles: ['core'],
        equipment: 'Cable Machine', difficulty: 'Intermediate', estimatedCalories: 75, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/1u19JquW9U0',
        instructions: [
          'Stand facing away from pulley holding rope overhead.',
          'Step forward and lean. Bend elbows to lower rope behind head.',
          'Extend arms straight forward/up.'
        ],
        tips: ['Keep elbows tucked close to head', 'Engage core for balance'],
        commonMistakes: ['Flaring elbows', 'Arching back']
      },

      // ==================== LEGS (10) ====================
      {
        exerciseName: 'Barbell Back Squat', targetMuscle: 'legs', secondaryMuscles: ['glutes', 'hamstrings', 'core'],
        equipment: 'Barbell, Squat Rack', difficulty: 'Intermediate', estimatedCalories: 150, estimatedDuration: 12,
        imageUrl: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/Uv_yQ-J5U0E',
        instructions: [
          'Rest the barbell on your upper traps. Keep feet shoulder-width apart.',
          'Push your hips back and bend your knees to lower your body.',
          'Squat down until your thighs are parallel to the floor.',
          'Drive back up through your heels to return to standing.'
        ],
        tips: ['Keep your chest up and core engaged', 'Do not let knees cave inwards'],
        commonMistakes: ['Lifting heels off the floor', 'Rounding the back', 'Not squatting deep enough']
      },
      {
        exerciseName: 'Romanian Deadlift', targetMuscle: 'legs', secondaryMuscles: ['hamstrings', 'glutes', 'lower back'],
        equipment: 'Barbell or Dumbbells', difficulty: 'Intermediate', estimatedCalories: 130, estimatedDuration: 10,
        imageUrl: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/JCXUYtwSSHs',
        instructions: [
          'Stand tall holding a barbell with an overhand grip.',
          'Hinge at your hips, sending them backwards with a slight knee bend.',
          'Lower the bar down the front of your shins until you feel a hamstring stretch.',
          'Drive hips forward, squeezing glutes to return to standing.'
        ],
        tips: ['Keep the bar close to your body', 'Keep back completely flat'],
        commonMistakes: ['Squatting the weight rather than hinging', 'Rounding the upper back']
      },
      {
        exerciseName: 'Leg Press', targetMuscle: 'legs', secondaryMuscles: ['quads', 'glutes'],
        equipment: 'Leg Press Machine', difficulty: 'Beginner', estimatedCalories: 120, estimatedDuration: 10,
        imageUrl: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/yZmx_Ac3880',
        instructions: [
          'Sit on leg press machine. Place feet shoulder-width on sled.',
          'Lower safety locks. Lower sled slowly towards chest (90 degrees).',
          'Push sled back up. Do not lock out knees.'
        ],
        tips: ['Keep lower back flat against seat pad', 'Press through heels'],
        commonMistakes: ['Locking knees at top', 'Lifting tailbone off seat']
      },
      {
        exerciseName: 'Leg Extensions', targetMuscle: 'legs', secondaryMuscles: ['quads'],
        equipment: 'Leg Extension Machine', difficulty: 'Beginner', estimatedCalories: 75, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1434596922112-19c563067271?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/YyvSfV9QOcY',
        instructions: [
          'Sit on leg extension machine. Place shins behind rollers.',
          'Extend legs straight forward slowly. Hold contraction.',
          'Lower rollers slowly back to start.'
        ],
        tips: ['Hold handles for stability', 'Focus on quads contraction'],
        commonMistakes: ['Using momentum', 'Adjusting roller pad too high']
      },
      {
        exerciseName: 'Lying Leg Curls', targetMuscle: 'legs', secondaryMuscles: ['hamstrings'],
        equipment: 'Leg Curl Machine', difficulty: 'Beginner', estimatedCalories: 75, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/1Tq3QdYUuHs',
        instructions: [
          'Lie face down on leg curl machine. Place heels under roller.',
          'Pull roller towards glutes. Squeeze hamstrings.',
          'Lower slowly back to start.'
        ],
        tips: ['Keep hips pressed flat against bench', 'Control descent'],
        commonMistakes: ['Lifting hips', 'Swinging weight']
      },
      {
        exerciseName: 'Dumbbell Walking Lunge', targetMuscle: 'legs', secondaryMuscles: ['quads', 'glutes'],
        equipment: 'Dumbbells', difficulty: 'Beginner', estimatedCalories: 100, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1434596922112-19c563067271?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/D7KaRcUTQeE',
        instructions: [
          'Hold dumbbells in each hand at your sides.',
          'Step forward with one leg and lower hips until both knees are bent at 90 degrees.',
          'Push off your back foot and step forward into the next lunge.'
        ],
        tips: ['Keep your chest upright', 'Do not let front knee extend past toes'],
        commonMistakes: ['Leaning too far forward', 'Front knee caving inward']
      },
      {
        exerciseName: 'Bulgarian Split Squat', targetMuscle: 'legs', secondaryMuscles: ['quads', 'glutes'],
        equipment: 'Dumbbells, Flat Bench', difficulty: 'Intermediate', estimatedCalories: 110, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1434596922112-19c563067271?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/hPtjKaLz3L8',
        instructions: [
          'Stand 2 feet in front of bench. Place rear foot laces-down on bench.',
          'Hold dumbbells. Lower hips until front thigh is parallel to floor.',
          'Drive back up.'
        ],
        tips: ['Keep weight in front heel', 'Core engaged'],
        commonMistakes: ['Front knee going past toes', 'Rounding upper back']
      },
      {
        exerciseName: 'Standing Calf Raises', targetMuscle: 'legs', secondaryMuscles: ['calves'],
        equipment: 'Calf Block / Dumbbells', difficulty: 'Beginner', estimatedCalories: 50, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1434596922112-19c563067271?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/3UWi44yN-wM',
        instructions: [
          'Stand on edge of block. Heels hanging off.',
          'Raise heels as high as possible. Hold contraction.',
          'Lower heels slowly down below block level.'
        ],
        tips: ['Full stretch at bottom', 'Hold peak for 1s'],
        commonMistakes: ['Bouncing', 'Bending knees']
      },
      {
        exerciseName: 'Barbell Hip Thrust', targetMuscle: 'legs', secondaryMuscles: ['glutes', 'hamstrings'],
        equipment: 'Barbell, Bench', difficulty: 'Intermediate', estimatedCalories: 120, estimatedDuration: 10,
        imageUrl: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/LM8XHLYJoYs',
        instructions: [
          'Sit on floor. Upper back against bench. Barbell over hips.',
          'Drive through heels to lift hips until thighs are in line with torso.',
          'Lower hips slowly back to start.'
        ],
        tips: ['Keep chin tucked', 'Squeeze glutes at peak'],
        commonMistakes: ['Arching lower back', 'Lifting heels']
      },
      {
        exerciseName: 'Goblet Squat', targetMuscle: 'legs', secondaryMuscles: ['quads', 'core'],
        equipment: 'Dumbbell / Kettlebell', difficulty: 'Beginner', estimatedCalories: 90, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1434596922112-19c563067271?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/MeIiGibTCIk',
        instructions: [
          'Hold dumbbell vertically against chest. Feet wider than shoulder-width.',
          'Hips back, knees out, squat down deep. Drive back up.'
        ],
        tips: ['Keep chest up', 'Elbows go inside knees'],
        commonMistakes: ['Heels rising', 'Rounding spine']
      },

      // ==================== ABS (10) ====================
      {
        exerciseName: 'Plank', targetMuscle: 'abs', secondaryMuscles: ['shoulders', 'core'],
        equipment: 'Bodyweight', difficulty: 'Beginner', estimatedCalories: 50, estimatedDuration: 5,
        imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/pvIjsG5yY-4',
        instructions: [
          'Rest your weight on your forearms and toes.',
          'Keep your body in a straight line from head to heels.',
          'Contract your core and hold the position.'
        ],
        tips: ['Keep your breathing steady', 'Do not let your hips sag'],
        commonMistakes: ['Sagging hips', 'Looking up (strain on neck)']
      },
      {
        exerciseName: 'Hanging Knee Raise', targetMuscle: 'abs', secondaryMuscles: ['hip flexors'],
        equipment: 'Pull-up Bar', difficulty: 'Intermediate', estimatedCalories: 60, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/jOP2PrKz92w',
        instructions: [
          'Hang from a pull-up bar with arms straight.',
          'Keep your legs together and slowly raise your knees toward your chest.',
          'Squeeze your abs at the top and lower back down under control.'
        ],
        tips: ['Avoid swinging', 'Exhale as you raise your knees'],
        commonMistakes: ['Using swing momentum', 'Not raising knees high enough']
      },
      {
        exerciseName: 'Ab Wheel Rollout', targetMuscle: 'abs', secondaryMuscles: ['shoulders', 'core'],
        equipment: 'Ab Wheel', difficulty: 'Advanced', estimatedCalories: 80, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/rqiDarhyMBE',
        instructions: [
          'Kneel on floor. Grip ab wheel handles.',
          'Roll wheel straight forward, extending body as far as possible.',
          'Squeeze abs to pull yourself back to start.'
        ],
        tips: ['Do not let lower back arch', 'Start with small rollouts'],
        commonMistakes: ['Arching lower back', 'Pulling with arms instead of abs']
      },
      {
        exerciseName: 'Bicycle Crunches', targetMuscle: 'abs', secondaryMuscles: ['obliques'],
        equipment: 'Bodyweight', difficulty: 'Beginner', estimatedCalories: 55, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/IwyvocWp_gA',
        instructions: [
          'Lie on back. Hands behind head. Knees bent.',
          'Lift shoulders. Bring right elbow to left knee, extending right leg.',
          'Alternate sides in cycling motion.'
        ],
        tips: ['Touch opposite knee and elbow', 'Perform slowly'],
        commonMistakes: ['Pulling neck', 'Moving too fast']
      },
      {
        exerciseName: 'Cable Woodchoppers', targetMuscle: 'abs', secondaryMuscles: ['obliques', 'shoulders'],
        equipment: 'Cable Machine', difficulty: 'Intermediate', estimatedCalories: 70, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/q7vO6qQ11bU',
        instructions: [
          'Stand sideways to cable machine. Grip handle with both hands high.',
          'Pull handle down and across body to opposite knee, rotating torso.',
          'Slowly return to start.'
        ],
        tips: ['Rotate hips and torso together', 'Keep arms straight'],
        commonMistakes: ['Bending elbows', 'Using arms to pull instead of core']
      },
      {
        exerciseName: 'Russian Twist', targetMuscle: 'abs', secondaryMuscles: ['obliques'],
        equipment: 'Bodyweight / Medicine Ball', difficulty: 'Beginner', estimatedCalories: 50, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/jOP2PrKz92w',
        instructions: [
          'Sit on floor. Lean back slightly, knees bent, feet off floor.',
          'Twist torso side to side, touching hands to floor on each side.'
        ],
        tips: ['Keep spine straight', 'Look towards direction of twist'],
        commonMistakes: ['Slouching back', 'Twisting only arms']
      },
      {
        exerciseName: 'Decline Sit-up', targetMuscle: 'abs', secondaryMuscles: ['hip flexors'],
        equipment: 'Decline Bench', difficulty: 'Intermediate', estimatedCalories: 65, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/jOP2PrKz92w',
        instructions: [
          'Secure feet on decline bench and lie back.',
          'Hands behind head. Crunch torso up to knees.',
          'Lower slowly back to bench.'
        ],
        tips: ['Focus on pulling ribs to hips', 'Do not pull neck'],
        commonMistakes: ['Swinging arms', 'Rounding lower back']
      },
      {
        exerciseName: "Captain's Chair Knee Raise", targetMuscle: 'abs', secondaryMuscles: ['hip flexors'],
        equipment: "Captain's Chair Machine", difficulty: 'Beginner', estimatedCalories: 60, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/jOP2PrKz92w',
        instructions: [
          'Rest forearms on pads. Hold grips.',
          'Raise knees up towards chest slowly. Lower under control.'
        ],
        tips: ['Keep back pressed flat against pad', 'Exhale on lift'],
        commonMistakes: ['Using momentum', 'Sagging shoulders']
      },
      {
        exerciseName: 'Lying Leg Raises', targetMuscle: 'abs', secondaryMuscles: ['core'],
        equipment: 'Bodyweight', difficulty: 'Beginner', estimatedCalories: 50, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/jOP2PrKz92w',
        instructions: [
          'Lie flat on back, hands under hips for lower back support.',
          'Keep legs straight, raise them to 90 degrees.',
          'Lower legs slowly until just above floor.'
        ],
        tips: ['Keep lower back pressed into floor', 'Do not touch feet to floor'],
        commonMistakes: ['Lower back arching off floor', 'Dropping legs fast']
      },
      {
        exerciseName: 'Mountain Climbers', targetMuscle: 'abs', secondaryMuscles: ['shoulders', 'cardio'],
        equipment: 'Bodyweight', difficulty: 'Beginner', estimatedCalories: 70, estimatedDuration: 6,
        imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/jOP2PrKz92w',
        instructions: [
          'Get into pushup plank. Drive knee to chest, alternate rapidly.'
        ],
        tips: ['Keep hips level', 'Move feet as fast as possible'],
        commonMistakes: ['Bouncing hips high', 'Dragging feet']
      },

      // ==================== CARDIO (10) ====================
      {
        exerciseName: 'Steady State Running', targetMuscle: 'cardio', secondaryMuscles: ['legs'],
        equipment: 'Treadmill / Outdoor', difficulty: 'Beginner', estimatedCalories: 250, estimatedDuration: 20,
        imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/fX6f4p-Jdsk',
        instructions: [
          'Start with a 5-minute warm-up walk.',
          'Maintain a steady, moderate pace breathing comfortably.',
          'Cool down with a 5-minute walk and stretches.'
        ],
        tips: ['Keep chest up and shoulders relaxed', 'Land softly on midfoot'],
        commonMistakes: ['Heel striking heavily', 'Leaning too far forward']
      },
      {
        exerciseName: 'Jump Rope', targetMuscle: 'cardio', secondaryMuscles: ['legs', 'calves'],
        equipment: 'Jump Rope', difficulty: 'Beginner', estimatedCalories: 120, estimatedDuration: 10,
        imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/H5zZzXFhOls',
        instructions: [
          'Hold jump rope handles with elbows close to your ribs.',
          'Use your wrists to swing the rope, not your shoulders.',
          'Jump just high enough for the rope to pass under your feet.'
        ],
        tips: ['Stay on the balls of your feet', 'Keep jumps small and bouncy'],
        commonMistakes: ['Jumping too high', 'Using arms/shoulders to rotate the rope']
      },
      {
        exerciseName: 'HIIT Burpee', targetMuscle: 'cardio', secondaryMuscles: ['full body'],
        equipment: 'Bodyweight', difficulty: 'Advanced', estimatedCalories: 150, estimatedDuration: 10,
        imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/qLBt_3W1_c0',
        instructions: [
          'From standing, squat down and place your hands on the floor.',
          'Jump your feet back into a plank position and do a pushup.',
          'Jump your feet back to the squat position.',
          'Explosively jump up into the air, reaching hands overhead.'
        ],
        tips: ['Pace yourself to maintain form', 'Land softly on your feet'],
        commonMistakes: ['Rounding the back in plank', 'Letting hips sag in pushup']
      },
      {
        exerciseName: 'Rowing Machine', targetMuscle: 'cardio', secondaryMuscles: ['back', 'arms', 'legs'],
        equipment: 'Rower', difficulty: 'Intermediate', estimatedCalories: 140, estimatedDuration: 15,
        imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/s2vK_p9uB_g',
        instructions: [
          'Sit on rower, strap feet. Grip handle. Extend arms, slide forward.',
          'Push off with legs first. Lean back slightly, pull handle to chest.',
          'Extend arms back, hinge torso forward, slide seat back.'
        ],
        tips: ['Legs do 60% of work, core 20%, arms 20%', 'Keep smooth cadence'],
        commonMistakes: ['Pulling with arms first', 'Rounding back']
      },
      {
        exerciseName: 'Stationary Cycling', targetMuscle: 'cardio', secondaryMuscles: ['legs', 'quads'],
        equipment: 'Spin Bike', difficulty: 'Beginner', estimatedCalories: 160, estimatedDuration: 20,
        imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/6kALZH559kw',
        instructions: [
          'Adjust seat height so leg has slight bend at bottom of stroke.',
          'Pedal smoothly maintaining a steady RPM.'
        ],
        tips: ['Keep chest open', 'Engage core'],
        commonMistakes: ['Seat height too low', 'Slouching over bars']
      },
      {
        exerciseName: 'Elliptical Trainer', targetMuscle: 'cardio', secondaryMuscles: ['full body'],
        equipment: 'Elliptical Machine', difficulty: 'Beginner', estimatedCalories: 130, estimatedDuration: 15,
        imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/6kALZH559kw',
        instructions: [
          'Step on pedals, grip handles. Move feet in oval motion.',
          'Push and pull handles with arms to distribute work.'
        ],
        tips: ['Keep posture upright', 'Do not lean on console'],
        commonMistakes: ['Heels lifting', 'Using zero resistance']
      },
      {
        exerciseName: 'Stair Climber', targetMuscle: 'cardio', secondaryMuscles: ['glutes', 'legs'],
        equipment: 'Stairmaster Machine', difficulty: 'Intermediate', estimatedCalories: 180, estimatedDuration: 15,
        imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/6kALZH559kw',
        instructions: [
          'Step on climber. Maintain upright posture.',
          'Step smoothly. Drive down through entire foot.'
        ],
        tips: ['Keep glutes active', 'Do not lean heavily on handrails'],
        commonMistakes: ['Hunching forward', 'Stepping on toes only']
      },
      {
        exerciseName: 'Kettlebell Swings', targetMuscle: 'cardio', secondaryMuscles: ['glutes', 'hamstrings', 'shoulders'],
        equipment: 'Kettlebell', difficulty: 'Intermediate', estimatedCalories: 140, estimatedDuration: 10,
        imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/s2vK_p9uB_g',
        instructions: [
          'Stand feet shoulder-width. Hinge forward at hips. Grab kettlebell.',
          'Swing kettlebell back between legs. Drive hips forward to swing bell to shoulder height.'
        ],
        tips: ['Power comes from hips hinge, not shoulders lift', 'Keep arms relaxed'],
        commonMistakes: ['Squatting instead of hinging', 'Arching lower back']
      },
      {
        exerciseName: 'Shadow Boxing', targetMuscle: 'cardio', secondaryMuscles: ['shoulders', 'arms', 'core'],
        equipment: 'None', difficulty: 'Beginner', estimatedCalories: 110, estimatedDuration: 12,
        imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/H5zZzXFhOls',
        instructions: [
          'Stand in boxing stance. Throw combinations (jab, cross, hook) in air.',
          'Keep moving feet, dodging and weaving.'
        ],
        tips: ['Keep hands up protecting face', 'Rotate hips into punches'],
        commonMistakes: ['Hyper-extending elbows', 'Flat feet']
      },
      {
        exerciseName: 'Jumping Jacks', targetMuscle: 'cardio', secondaryMuscles: ['legs'],
        equipment: 'Bodyweight', difficulty: 'Beginner', estimatedCalories: 80, estimatedDuration: 8,
        imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/H5zZzXFhOls',
        instructions: [
          'Stand feet together. Jump while spreading legs and clapping hands overhead.',
          'Jump back to start.'
        ],
        tips: ['Land softly on balls of feet', 'Keep arms straight'],
        commonMistakes: ['Landing flat-footed', 'Stiff knees']
      }
    ];

    await Exercise.deleteMany({});
    const seeded = await Exercise.insertMany(seedData);
    res.json({ success: true, count: seeded.length, message: "Exercises seeded successfully" });
  } catch (error) {
    console.error("Seed Error:", error);
    res.status(500).json({ success: false, message: "Server error seeding data." });
  }
};
