// backend/routes/galleryRoutes.js
const express = require('express');
const router = express.Router();
const { getImages, getImagesByType, getImage } = require('../controllers/galleryController');

// @route   GET /api/gallery
// @desc    Get all images
router.get('/', getImages);

// @route   GET /api/gallery/type/:type
// @desc    Get images by type
router.get('/type/:type', getImagesByType);

// @route   GET /api/gallery/:id
// @desc    Get single image
router.get('/:id', getImage);

module.exports = router;