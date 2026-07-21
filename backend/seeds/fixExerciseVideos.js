require('dotenv').config();
const mongoose = require('mongoose');
const yts = require('yt-search');
const Exercise = require('./models/Exercise');

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const exercises = await Exercise.find();
    let updated = 0;

    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      // Always fetch a fresh high-quality video for every exercise
      console.log(`[${i+1}/${exercises.length}] Searching video for: ${ex.exerciseName}...`);
      
      try {
        const r = await yts(`${ex.exerciseName} exercise form tutorial`);
        const videos = r.videos.slice(0, 3);
        if (videos.length > 0) {
          // Find the shortest/best tutorial or just use the top result
          const video = videos[0];
          ex.videoUrl = `https://www.youtube.com/embed/${video.videoId}`;
          await ex.save();
          updated++;
          console.log(` -> Found: ${video.title}`);
        }
      } catch (err) {
        console.error(` -> Error searching for ${ex.exerciseName}: ${err.message}`);
      }
      
      // tiny delay to avoid rate limit
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log(`\nSuccessfully updated ${updated} exercises with REAL YouTube demo videos!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
