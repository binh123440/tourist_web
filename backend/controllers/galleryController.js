// backend/controllers/galleryController.js
const Image = require('../models/Image');
const cloudinary = require('../config/cloudinary');

// @desc    Get all images
// @route   GET /api/gallery
// @access  Public
exports.getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    
    // Lấy thông tin chi tiết hơn cho debug
    console.log('Images found:', images.length);
    if (images.length > 0) {
      console.log('Sample image:', {
        id: images[0]._id,
        name: images[0].name,
        url: images[0].url,
        cloudinaryId: images[0].cloudinaryId
      });
    }
    
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get images by type
// @route   GET /api/gallery/type/:type
// @access  Public
exports.getImagesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const images = await Image.find({ type }).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    console.error('Error fetching images by type:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single image
// @route   GET /api/gallery/:id
// @access  Public
exports.getImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};