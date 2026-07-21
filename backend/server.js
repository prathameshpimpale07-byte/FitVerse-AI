var express = require("express");
var cors = require("cors");
var dotenv = require("dotenv");
var http = require("http");
var { Server } = require("socket.io");
var { initSocket } = require('./utils/socketManager');
var connectDB = require('./config/db.js');
var errorHandler = require('./middleware/errorHandler.js');
var path = require("path");

dotenv.config();
connectDB();

var app = express();
var server = http.createServer(app);
var io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  }
});
const { initCronJobs } = require('./utils/notificationCron');

initSocket(io);
initCronJobs();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "FitVerse API is running \u{1F680}", timestamp: /* @__PURE__ */ new Date() });
});

app.use("/api/auth", require('./routes/auth.js'));
app.use("/api/users", require('./routes/users.js'));
app.use("/api/workouts", require('./routes/workouts.js'));
app.use("/api/history", require('./routes/history.js'));
app.use("/api/favorites", require('./routes/favorites.js'));
app.use("/api/diets", require('./routes/diets.js'));
app.use("/api/memberships", require('./routes/memberships.js'));
app.use("/api/trainers", require('./routes/trainers.js'));
app.use("/api/progress", require('./routes/progress.js'));
app.use("/api/admin", require('./routes/admin.js'));
app.use("/api/ai", require('./routes/ai.js'));
app.use("/api/dashboard", require('./routes/dashboard.js'));
app.use("/api/exercises", require('./routes/exercises.js'));
app.use("/api/contact", require('./routes/contactRoutes.js'));
app.use("/api/workout", require('./routes/workoutSession.js'));
app.use("/api/categories", require('./routes/categories.js'));
app.use("/api/category", require('./routes/category.js'));
app.use("/api/exercise", require('./routes/exercise.js'));
app.use("/api/challenges", require('./routes/challenges.js'));
app.use("/api/records", require('./routes/records.js'));
app.use("/api/notifications", require('./routes/notifications.js'));



app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

var PORT = process.env.PORT || 5e3;
server.listen(PORT, () => {
  console.log(`\u{1F680} FitVerse Server running on http://localhost:${PORT}`);
  console.log(`\u{1F4CA} Environment: ${process.env.NODE_ENV}`);
});
