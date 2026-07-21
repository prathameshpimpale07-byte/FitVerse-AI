const express = require('express');
const router = express.Router();
const { getHistory, saveHistory, deleteHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getHistory);
router.post('/', saveHistory);
router.delete('/:id', deleteHistory);

module.exports = router;
