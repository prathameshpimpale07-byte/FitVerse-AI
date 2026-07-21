require('dotenv').config();
const mongoose = require('mongoose');
const Food = require('./models/Food');

const seedFoods = [
  // Breakfast items (Veg & Vegan)
  {
    foodName: 'Oats & Milk Bowl', category: 'breakfast', calories: 420, protein: 18, carbs: 62, fat: 8, fiber: 10,
    servingSize: '1 Bowl', prepTime: 5, imageUrl: 'https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?auto=format&fit=crop&w=600&q=80',
    recipe: ['Add oats and milk to a saucepan.', 'Simmer over medium heat for 5 minutes, stirring occasionally.', 'Top with sliced bananas or honey.'],
    alternativeFoods: ['Quinoa Porridge', 'Muesli Bowl'], cost: 60
  },
  {
    foodName: 'Scrambled Eggs with Toast', category: 'breakfast', calories: 380, protein: 24, carbs: 28, fat: 16, fiber: 3,
    servingSize: '2 Eggs + 2 Toast', prepTime: 8, imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    recipe: ['Whisk eggs in a bowl with a pinch of salt and pepper.', 'Melt butter in a non-stick pan, pour in eggs and scramble gently.', 'Serve warm with toasted whole-wheat bread.'],
    alternativeFoods: ['Tofu Scramble', 'Boiled Eggs'], cost: 50
  },
  {
    foodName: 'Paneer Stuffed Paratha', category: 'breakfast', calories: 480, protein: 18, carbs: 58, fat: 18, fiber: 6,
    servingSize: '1 Paratha', prepTime: 15, imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
    recipe: ['Grate paneer and mix with green chilies, coriander, and spices.', 'Stuff paneer mix inside wheat dough ball and roll it flat.', 'Cook on hot tandoor/griddle with ghee until golden brown.'],
    alternativeFoods: ['Tofu Paratha', 'Cheela'], cost: 45
  },
  {
    foodName: 'Vegan Green Protein Smoothie', category: 'breakfast', calories: 310, protein: 25, carbs: 35, fat: 6, fiber: 8,
    servingSize: '1 Large Glass', prepTime: 5, imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
    recipe: ['Add spinach, banana, almond milk, and vegan protein powder to a blender.', 'Blend on high speed until completely smooth.', 'Drink immediately.'],
    alternativeFoods: ['Banana Oats Shake', 'Soy Milk Shake'], cost: 80
  },
  {
    foodName: 'Avocado Toast', category: 'breakfast', calories: 290, protein: 7, carbs: 24, fat: 18, fiber: 9,
    servingSize: '1 Slice', prepTime: 5, imageUrl: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80',
    recipe: ['Mash avocado with lemon juice, salt, and red pepper flakes.', 'Spread evenly onto hot toasted sourdough bread.', 'Serve fresh.'],
    alternativeFoods: ['Hummus Toast', 'Peanut Butter Toast'], cost: 120
  },

  // Snacks
  {
    foodName: 'Mixed Nuts & Dry Fruits', category: 'snack', calories: 240, protein: 8, carbs: 12, fat: 18, fiber: 4,
    servingSize: '1 Handful (35g)', prepTime: 1, imageUrl: 'https://images.unsplash.com/photo-1596560548464-f01068e3c9eb?auto=format&fit=crop&w=600&q=80',
    recipe: ['Combine almonds, walnuts, cashews, and raisins.', 'Store in an airtight jar.', 'Consume raw.'],
    alternativeFoods: ['Pumpkin Seeds', 'Roasted Chickpeas'], cost: 40
  },
  {
    foodName: 'Greek Yogurt with Berries', category: 'snack', calories: 180, protein: 15, carbs: 18, fat: 4, fiber: 3,
    servingSize: '1 Cup (150g)', prepTime: 3, imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    recipe: ['Spoon Greek yogurt into a bowl.', 'Top with fresh strawberries, blueberries, and a drizzle of honey.'],
    alternativeFoods: ['Soy Yogurt', 'Cottage Cheese'], cost: 90
  },
  {
    foodName: 'Peanut Butter & Banana Rice Cakes', category: 'snack', calories: 260, protein: 9, carbs: 32, fat: 12, fiber: 4,
    servingSize: '2 Rice Cakes', prepTime: 3, imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80',
    recipe: ['Spread peanut butter evenly over crunchy brown rice cakes.', 'Top with sliced bananas and chia seeds.'],
    alternativeFoods: ['PB on Apple Slices', 'Oat cookies'], cost: 35
  },
  {
    foodName: 'Roasted Chana (Chickpeas)', category: 'snack', calories: 160, protein: 10, carbs: 22, fat: 3, fiber: 6,
    servingSize: '1 Small Cup', prepTime: 2, imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80',
    recipe: ['Dry roast spiced chickpeas until crunchy.', 'Optionally toss with chopped onions, tomatoes, and lemon juice.'],
    alternativeFoods: ['Boiled Sprouts', 'Roasted Edamame'], cost: 15
  },

  // Lunch items
  {
    foodName: 'Grilled Chicken Breast & Rice', category: 'lunch', calories: 580, protein: 48, carbs: 64, fat: 10, fiber: 4,
    servingSize: '1 Plate', prepTime: 25, imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
    recipe: ['Marinate chicken with garlic, olive oil, and herbs.', 'Grill chicken on pan for 6-8 minutes each side.', 'Serve with steamed brown rice and broccoli.'],
    alternativeFoods: ['Grilled Tofu & Quinoa', 'Fish & Rice'], cost: 150
  },
  {
    foodName: 'Lentil Dal & Basmati Rice', category: 'lunch', calories: 440, protein: 18, carbs: 74, fat: 6, fiber: 12,
    servingSize: '1 Plate', prepTime: 20, imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    recipe: ['Pressure cook yellow/red lentils with turmeric and salt.', 'Tempering (Tadka): Heat cumin, garlic, and onions in ghee and pour over dal.', 'Serve hot with boiled basmati rice.'],
    alternativeFoods: ['Chole Rice', 'Rajma Chawal'], cost: 40
  },
  {
    foodName: 'High Protein Paneer Bhurji', category: 'lunch', calories: 460, protein: 22, carbs: 12, fat: 36, fiber: 3,
    servingSize: '1 Bowl', prepTime: 12, imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    recipe: ['Saute onions, ginger-garlic paste, and tomatoes in a pan.', 'Add crumbled paneer, spices (turmeric, garam masala), and cook for 5 minutes.', 'Garnish with fresh cilantro.'],
    alternativeFoods: ['Tofu Bhurji', 'Egg Bhurji'], cost: 70
  },
  {
    foodName: 'Quinoa Buddha Salad Bowl', category: 'lunch', calories: 390, protein: 14, carbs: 54, fat: 12, fiber: 11,
    servingSize: '1 Bowl', prepTime: 15, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    recipe: ['Rinse and boil quinoa in water for 15 minutes.', 'Combine cooked quinoa with cucumber, cherry tomatoes, olives, and chickpeas.', 'Toss with olive oil and lemon juice dressing.'],
    alternativeFoods: ['Brown Rice Salad', 'Couscous Salad'], cost: 110
  },

  // Dinner items
  {
    foodName: 'Baked Salmon with Sweet Potato', category: 'dinner', calories: 620, protein: 42, carbs: 48, fat: 22, fiber: 6,
    servingSize: '1 Plate', prepTime: 30, imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
    recipe: ['Season salmon fillet with dill, lemon juice, and olive oil.', 'Roast sweet potato wedges with salt and paprika.', 'Bake both at 200°C for 20 minutes.'],
    alternativeFoods: ['Baked Tofu & Potato', 'Grilled Sea Bass'], cost: 280
  },
  {
    foodName: 'Soya Chunk & Veggie Stir-Fry', category: 'dinner', calories: 380, protein: 32, carbs: 32, fat: 8, fiber: 9,
    servingSize: '1 Bowl', prepTime: 15, imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
    recipe: ['Boil soya chunks in water and squeeze dry.', 'Stir-fry bell peppers, beans, and carrots with soy sauce and vinegar.', 'Add soya chunks, cook for 5 mins and serve warm.'],
    alternativeFoods: ['Tofu Stir-fry', 'Mushroom Stir-fry'], cost: 35
  },
  {
    foodName: 'Tofu Broccoli Noodles', category: 'dinner', calories: 420, protein: 20, carbs: 64, fat: 10, fiber: 7,
    servingSize: '1 Plate', prepTime: 18, imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
    recipe: ['Boil whole wheat noodles. Air fry or pan sear tofu cubes.', 'Saute broccoli and garlic in sesame oil.', 'Toss noodles, tofu, and broccoli with light soy sauce.'],
    alternativeFoods: ['Quinoa Veg Stir-fry', 'Chicken Stir-fry Noodles'], cost: 85
  },
  {
    foodName: 'Paneer Tikka Salad', category: 'dinner', calories: 450, protein: 24, carbs: 14, fat: 34, fiber: 4,
    servingSize: '1 Plate', prepTime: 20, imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
    recipe: ['Marinate paneer cubes and bell peppers in spiced Greek yogurt.', 'Grill or bake at 220°C for 12-15 minutes.', 'Toss with fresh lettuce, onions, and chat masala.'],
    alternativeFoods: ['Chicken Tikka Salad', 'Tofu Tikka Salad'], cost: 90
  }
];

const run = async () => {
  try {
    console.log("Connecting to Database for Diet Seeding...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");
    
    console.log("Clearing old Foods...");
    await Food.deleteMany({});
    
    console.log("Inserting seeded Foods...");
    const seeded = await Food.insertMany(seedFoods);
    console.log(`Seeding successful! Seeded ${seeded.length} foods & recipes.`);
    
    await mongoose.disconnect();
  } catch (err) {
    console.error("Seed Error:", err);
  }
};

run();
