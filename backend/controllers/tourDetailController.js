const TourDetail = require('../models/TourDetail');
const Tour = require('../models/Tour');

// @desc    Get tour detail by tourId
// @route   GET /api/tourDetails/:tourId
// @access  Public
exports.getTourDetailByTourId = async (req, res) => {
  try {
    const tourDetail = await TourDetail.findOne({ tourId: req.params.tourId });
    const parentTour = await Tour.findOne({ link: tourDetail.tourId });
    if (!tourDetail) {
      return res.status(404).json({ message: 'Tour detail not found' });
    }

    res.json({tour: parentTour, detail: tourDetail});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};