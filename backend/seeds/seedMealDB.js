const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Food = require('./models/Food');

dotenv.config();

async function fetchMeals(category, limit) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  const data = await res.json();
  const meals = data.meals.slice(0, limit);
  
  const detailedMeals = [];
  for (let m of meals) {
    const detailRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${m.idMeal}`);
    const detailData = await detailRes.json();
    detailedMeals.push(detailData.meals[0]);
  }
  return detailedMeals;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://prathameshpimpale07:xomgL6u8pS74C2X7@fitverse.b0vel6z.mongodb.net/fitverse?retryWrites=true&w=majority");
    console.log("Connected to MongoDB.");
    
    console.log("Fetching Breakfast...");
    const breakfasts = await fetchMeals('Breakfast', 10);
    console.log("Fetching Vegetarian (Lunch)...");
    const lunches = await fetchMeals('Vegetarian', 10);
    console.log("Fetching Chicken (Dinner)...");
    const dinners = await fetchMeals('Chicken', 10);
    console.log("Fetching Side (Snack)...");
    const snacks = await fetchMeals('Side', 10);
    
    const recipes = [];
    
    const formatMeals = (meals, mappedCategory) => {
      meals.forEach(m => {
        recipes.push({
          foodName: m.strMeal,
          category: mappedCategory,
          calories: Math.floor(Math.random() * (600 - 200 + 1)) + 200,
          protein: Math.floor(Math.random() * 40) + 10,
          carbs: Math.floor(Math.random() * 60) + 20,
          fat: Math.floor(Math.random() * 20) + 5,
          servingSize: '1 portion',
          prepTime: Math.floor(Math.random() * 30) + 10,
          imageUrl: m.strMealThumb,
          recipe: m.strInstructions.split('\r\n').filter(s => s.trim().length > 0)
        });
      });
    };
    
    formatMeals(breakfasts, 'breakfast');
    formatMeals(lunches, 'lunch');
    formatMeals(dinners, 'dinner');
    formatMeals(snacks, 'snack');
    
    await Food.deleteMany({});
    console.log("Deleted old foods.");

    await Food.insertMany(recipes);
    console.log(`Inserted ${recipes.length} REAL recipes with matching photos!`);
    
    mongoose.disconnect();
    console.log("Done.");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
