const express = require('express');
const router = express.Router();
const { getExercises, getExerciseById, seedExercises } = require('../controllers/exerciseController');

router.get('/', getExercises);
router.get('/:id', getExerciseById);
router.post('/seed', seedExercises);

module.exports = router;
