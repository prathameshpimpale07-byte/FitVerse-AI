const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Food = require('./models/Food');

dotenv.config();

async function fix() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://prathameshpimpale07:xomgL6u8pS74C2X7@fitverse.b0vel6z.mongodb.net/fitverse?retryWrites=true&w=majority");
    console.log("Connected to MongoDB.");
    
    const foods = await Food.find({});
    let updated = 0;
    
    for (let f of foods) {
      if (f.recipe && f.recipe.length === 1 && f.recipe[0].length > 100) {
        // Split by period followed by space, keeping the period in the preceding sentence
        const steps = f.recipe[0].split(/(?<=\.)\s+/).filter(s => s.trim().length > 0);
        if (steps.length > 1) {
          f.recipe = steps;
          await f.save();
          updated++;
          console.log(`Fixed formatting for: ${f.foodName}`);
        }
      }
    }
    
    console.log(`Updated ${updated} recipes.`);
    mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fix();
