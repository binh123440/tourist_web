const TourDetail = require('../models/TourDetail');

// @desc    Get tour detail by tourId
// @route   GET /api/tourDetails/:tourId
// @access  Public
exports.getTourDetailByTourId = async (req, res) => {
  try {
    const tourDetail = await TourDetail.findOne({ tourId: req.params.tourId });
    if (!tourDetail) {
      return res.status(404).json({ message: 'Tour detail not found' });
    }
    res.json(tourDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};