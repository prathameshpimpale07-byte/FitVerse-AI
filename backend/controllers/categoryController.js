const Exercise = require('../models/Exercise');

const categoriesMetadata = {
  chest: {
    name: 'Chest',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80', // Man doing pushup/chest press
    estimatedTime: '45-60 min',
    difficulty: 'Intermediate'
  },
  back: {
    name: 'Back',
    image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?auto=format&fit=crop&w=600&q=80', // Back muscles pullup
    estimatedTime: '45-60 min',
    difficulty: 'Intermediate'
  },
  shoulders: {
    name: 'Shoulders',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80', // Boxing/Shoulders
    estimatedTime: '30-45 min',
    difficulty: 'Intermediate'
  },
  biceps: {
    name: 'Biceps',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80', // Bicep curl / Rings
    estimatedTime: '30 min',
    difficulty: 'Beginner'
  },
  triceps: {
    name: 'Triceps',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80', // Tricep dip/extension
    estimatedTime: '30 min',
    difficulty: 'Beginner'
  },
  legs: {
    name: 'Legs',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80', // Squat rack
    estimatedTime: '60-75 min',
    difficulty: 'Intermediate'
  },
  abs: {
    name: 'Abs',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80', // Plank/Abs
    estimatedTime: '15-20 min',
    difficulty: 'Beginner'
  },
  cardio: {
    name: 'Cardio',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80', // Running outdoors
    estimatedTime: '30-45 min',
    difficulty: 'Beginner'
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = [];
    for (const [id, meta] of Object.entries(categoriesMetadata)) {
      const count = await Exercise.countDocuments({ targetMuscle: id });
      categories.push({
        id,
        ...meta,
        totalExercises: count
      });
    }
    res.json({ success: true, categories });
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching categories." });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const meta = categoriesMetadata[id.toLowerCase()];
    if (!meta) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    const count = await Exercise.countDocuments({ targetMuscle: id.toLowerCase() });
    const exercises = await Exercise.find({ targetMuscle: id.toLowerCase() }).sort({ exerciseName: 1 });
    res.json({
      success: true,
      category: {
        id: id.toLowerCase(),
        ...meta,
        totalExercises: count
      },
      exercises
    });
  } catch (error) {
    console.error("Get Category By ID Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching category." });
  }
};
