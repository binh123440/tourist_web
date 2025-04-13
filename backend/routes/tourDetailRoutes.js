const express = require('express');
const router = express.Router();
const { getTourDetailByTourId } = require('../controllers/tourDetailController');

router.get('/:tourId', getTourDetailByTourId);

module.exports = router;