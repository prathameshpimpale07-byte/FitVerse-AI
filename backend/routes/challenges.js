const express = require('express');
const router = express.Router();
const { getChallenges, joinChallenge } = require('../controllers/challengesController');
const { protect } = require('../middleware/auth');

router.get('/', getChallenges);
router.post('/join/:id', protect, joinChallenge);

module.exports = router;
