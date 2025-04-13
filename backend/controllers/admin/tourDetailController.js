const TourDetail = require('../../models/TourDetail');
const Tour = require('../../models/Tour');

// @desc    Lấy tất cả chi tiết tour
// @route   GET /api/admin/tour-details
// @access  Admin
exports.getTourDetails = async (req, res) => {
  try {
    const tourDetails = await TourDetail.find().sort({ createdAt: -1 });
    res.json(tourDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Lấy chi tiết tour theo id
// @route   GET /api/admin/tour-details/:id
// @access  Admin
exports.getTourDetail = async (req, res) => {
  try {
    const tourDetail = await TourDetail.findById(req.params.id);
    if (!tourDetail) {
      return res.status(404).json({ message: 'Không tìm thấy chi tiết tour' });
    }
    res.json(tourDetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Tạo chi tiết tour mới
// @route   POST /api/admin/tour-details
// @access  Admin
exports.createTourDetail = async (req, res) => {
  try {
    const { tourId, title, intro, days, images } = req.body;

    // Kiểm tra tour tồn tại không
    const tourExists = await Tour.findOne({ link: tourId });
    if (!tourExists) {
      return res.status(400).json({ message: 'Tour với ID này không tồn tại' });
    }

    // Kiểm tra tourDetail đã tồn tại chưa
    const existingTourDetail = await TourDetail.findOne({ tourId });
    if (existingTourDetail) {
      return res.status(400).json({ message: 'Chi tiết tour này đã tồn tại' });
    }

    const newTourDetail = new TourDetail({
      tourId,
      title,
      intro,
      days,
      images
    });

    const savedTourDetail = await newTourDetail.save();
    res.status(201).json(savedTourDetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Cập nhật chi tiết tour
// @route   PUT /api/admin/tour-details/:id
// @access  Admin
exports.updateTourDetail = async (req, res) => {
  try {
    const { tourId, title, intro, days, images } = req.body;

    // Nếu đang thay đổi tourId, kiểm tra tour mới có tồn tại không
    if (tourId) {
      const tourExists = await Tour.findOne({ link: tourId });
      if (!tourExists) {
        return res.status(400).json({ message: 'Tour với ID này không tồn tại' });
      }

      // Kiểm tra xem tourId mới đã có chi tiết tour chưa (trừ tour hiện tại)
      const existingDetail = await TourDetail.findOne({
        tourId,
        _id: { $ne: req.params.id }
      });

      if (existingDetail) {
        return res.status(400).json({ message: 'Chi tiết tour này đã tồn tại cho tour khác' });
      }
    }

    // Tìm chi tiết tour hiện tại
    const tourDetail = await TourDetail.findById(req.params.id);
    if (!tourDetail) {
      return res.status(404).json({ message: 'Không tìm thấy chi tiết tour' });
    }

    // Cập nhật các trường
    tourDetail.tourId = tourId || tourDetail.tourId;
    tourDetail.title = title || tourDetail.title;
    tourDetail.intro = intro || tourDetail.intro;
    
    if (days && Array.isArray(days)) {
      tourDetail.days = days;
    }
    
    if (images && Array.isArray(images)) {
      tourDetail.images = images;
    }

    const updatedTourDetail = await tourDetail.save();
    res.json(updatedTourDetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Xóa chi tiết tour
// @route   DELETE /api/admin/tour-details/:id
// @access  Admin
exports.deleteTourDetail = async (req, res) => {
  try {
    const tourDetail = await TourDetail.findById(req.params.id);
    if (!tourDetail) {
      return res.status(404).json({ message: 'Không tìm thấy chi tiết tour' });
    }

    await tourDetail.deleteOne();
    res.json({ message: 'Chi tiết tour đã được xóa' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};