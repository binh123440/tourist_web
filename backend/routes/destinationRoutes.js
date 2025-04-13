const express = require('express');
const router = express.Router();
const { getDestinations, getDestination } = require('../controllers/destinationController');

router.get('/', getDestinations);
router.get('/:id', getDestination);

module.exports = router;