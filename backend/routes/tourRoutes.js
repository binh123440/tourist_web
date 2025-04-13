const express = require('express');
const router = express.Router();
const { getTours, getTour } = require('../controllers/tourController');

router.get('/', getTours);
router.get('/:id', getTour);

module.exports = router;