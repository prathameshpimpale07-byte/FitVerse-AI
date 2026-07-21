const express = require('express');
const router = express.Router();
const { getExerciseById } = require('../controllers/exerciseController');

router.get('/:id', getExerciseById);

module.exports = router;
