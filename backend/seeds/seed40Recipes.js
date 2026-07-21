const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Food = require('./models/Food');

dotenv.config();

const breakfastImages = [
  "1493770348161-369560ae357d", "1482049142915-52a4e43f30f5", "1506084868230-bb4194f4e274",
  "1525351484163-e445a401c518", "1495214787407-b1523315a682", "1494390248081-4e521a5940db",
  "1494859802808-5274392b6045", "1513442542250-854d436a73f2", "1484723091772-468205f13e71", "1522814896792-7f7247a32bd0"
];

const lunchImages = [
  "1512621776951-a57141f2eefd", "1504630083234-14187a9df0f5", "1546069901-ba9599a7e63c",
  "1476224203421-9ce22c7a40ec", "1564834724105-9e8b7f329972", "1511690655006-2591605b0b2e",
  "1467003909585-2f8a72700288", "1512058564366-18510be2db19", "1473093295043-cdd812d0e601", "1504544750208-dc0358e63f7f"
];

const dinnerImages = [
  "1555939594-58d7cb561ad1", "1504754522776-8094df872a0d", "1432139555190-58524dae6a55",
  "1544025162-d76694265947", "1473093295043-cdd812d0e601", "1504630083234-14187a9df0f5",
  "1546069901-ba9599a7e63c", "1512621776951-a57141f2eefd", "1476224203421-9ce22c7a40ec", "1564834724105-9e8b7f329972"
];

const snackImages = [
  "1505253716362-afbea18ae27f", "1475090169767-40ed8d18f67d", "1515003197201-22c0b29ce3e8",
  "1485962398705-fc6a4ea3e369", "1505253668822-42074d58a7f0", "1505253668822-42074d58a7f0",
  "1475090169767-40ed8d18f67d", "1515003197201-22c0b29ce3e8", "1485962398705-fc6a4ea3e369", "1505253716362-afbea18ae27f"
];

const getImage = (arr, index) => `https://images.unsplash.com/photo-${arr[index % arr.length]}?auto=format&fit=crop&w=800&q=80`;

const recipes = [
  // BREAKFAST (10)
  ...Array.from({ length: 10 }).map((_, i) => ({
    foodName: `Breakfast Recipe ${i+1}`,
    category: 'breakfast',
    calories: 300 + (i * 20),
    protein: 15 + i,
    carbs: 40 + i,
    fat: 10 + i,
    servingSize: '1 bowl',
    prepTime: 10 + i,
    imageUrl: getImage(breakfastImages, i),
    recipe: ['Step 1: Prepare ingredients.', 'Step 2: Cook.', 'Step 3: Serve and enjoy!']
  })),
  // LUNCH (10)
  ...Array.from({ length: 10 }).map((_, i) => ({
    foodName: `Lunch Recipe ${i+1}`,
    category: 'lunch',
    calories: 500 + (i * 30),
    protein: 25 + i * 2,
    carbs: 50 + i * 2,
    fat: 20 + i,
    servingSize: '1 plate',
    prepTime: 20 + i,
    imageUrl: getImage(lunchImages, i),
    recipe: ['Step 1: Chop vegetables.', 'Step 2: Grill protein.', 'Step 3: Mix and season.']
  })),
  // DINNER (10)
  ...Array.from({ length: 10 }).map((_, i) => ({
    foodName: `Dinner Recipe ${i+1}`,
    category: 'dinner',
    calories: 450 + (i * 25),
    protein: 30 + i * 2,
    carbs: 40 + i,
    fat: 15 + i,
    servingSize: '1 portion',
    prepTime: 25 + i,
    imageUrl: getImage(dinnerImages, i),
    recipe: ['Step 1: Marinate.', 'Step 2: Bake or Roast.', 'Step 3: Garnish.']
  })),
  // SNACKS (10)
  ...Array.from({ length: 10 }).map((_, i) => ({
    foodName: `Snack Recipe ${i+1}`,
    category: 'snack',
    calories: 150 + (i * 10),
    protein: 5 + i,
    carbs: 20 + i,
    fat: 5 + i,
    servingSize: '1 handful',
    prepTime: 5,
    imageUrl: getImage(snackImages, i),
    recipe: ['Step 1: Mix items.', 'Step 2: Serve immediately.']
  })),
];

const bNames = ["Oatmeal Delight", "Avocado Toast", "Protein Pancakes", "Greek Yogurt Bowl", "Chia Seed Pudding", "Egg Muffin", "Breakfast Burrito", "Smoothie Bowl", "French Toast", "Fruit Salad"];
const lNames = ["Quinoa Salad", "Chicken Wrap", "Lentil Soup", "Sushi Bowl", "Pasta Salad", "Veggie Sandwich", "Tikka Masala", "Poke Bowl", "BLT Sandwich", "Caesar Salad"];
const dNames = ["Salmon Steak", "Steak Frites", "Vegan Chili", "Spaghetti Bolognese", "Roast Chicken", "Pad Thai", "Margherita Pizza", "Beef Stew", "Tofu Stir Fry", "Shrimp Tacos"];
const sNames = ["Mixed Nuts", "Apple & Peanut Butter", "Hummus & Pita", "Protein Bar", "Trail Mix", "Roasted Chickpeas", "Edamame", "Rice Cakes", "Hard Boiled Eggs", "Berry Mix"];

recipes.slice(0, 10).forEach((r, i) => r.foodName = bNames[i]);
recipes.slice(10, 20).forEach((r, i) => r.foodName = lNames[i]);
recipes.slice(20, 30).forEach((r, i) => r.foodName = dNames[i]);
recipes.slice(30, 40).forEach((r, i) => r.foodName = sNames[i]);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://prathameshpimpale07:xomgL6u8pS74C2X7@fitverse.b0vel6z.mongodb.net/fitverse?retryWrites=true&w=majority");
    console.log("Connected to MongoDB.");
    
    await Food.deleteMany({});
    console.log("Deleted old foods.");

    await Food.insertMany(recipes);
    console.log("Inserted 40 new recipes!");
    
    mongoose.disconnect();
    console.log("Done.");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
