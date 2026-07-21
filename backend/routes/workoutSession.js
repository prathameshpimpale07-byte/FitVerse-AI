const express = require('express');
const router = express.Router();
const { startWorkout, completeWorkout } = require('../controllers/workoutSessionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/start', startWorkout);
router.post('/complete', completeWorkout);

module.exports = router;
