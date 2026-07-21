const express = require('express');
const router = express.Router();
const { getPersonalRecords, addOrUpdateRecord, deletePersonalRecord } = require('../controllers/recordsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getPersonalRecords);
router.post('/', addOrUpdateRecord);
router.delete('/:id', deletePersonalRecord);

module.exports = router;
