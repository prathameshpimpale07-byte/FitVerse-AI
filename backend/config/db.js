var mongoose = require("mongoose");
    var connectDB2 = async () => {
      try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`\u2705 MongoDB Connected: ${conn.connection.host}`);
      } catch (error) {
        console.error(`\u274C MongoDB Connection Error: ${error.message}`);
        process.exit(1);
      }
    };
    module.exports = connectDB2;
