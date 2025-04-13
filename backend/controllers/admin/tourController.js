const Tour = require('../../models/Tour');
const TourDetail = require('../../models/TourDetail');

// @desc    Lấy tất cả tours
// @route   GET /api/admin/tours
// @access  Admin
exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find().sort({ createdAt: -1 });
    res.json(tours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Lấy tour theo id
// @route   GET /api/admin/tours/:id
// @access  Admin
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Không tìm thấy tour' });
    }
    res.json(tour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Tạo tour mới
// @route   POST /api/admin/tours
// @access  Admin
exports.createTour = async (req, res) => {
  try {
    const { date, destination, title, image, description, link } = req.body;

    // Kiểm tra link đã tồn tại chưa
    const existingTour = await Tour.findOne({ link });
    if (existingTour) {
      return res.status(400).json({ message: 'Tour với link này đã tồn tại' });
    }

    const newTour = new Tour({
      date,
      destination,
      title,
      image,
      description,
      link
    });

    const savedTour = await newTour.save();
    res.status(201).json(savedTour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Cập nhật tour
// @route   PUT /api/admin/tours/:id
// @access  Admin
exports.updateTour = async (req, res) => {
  try {
    const { date, destination, title, image, description, link } = req.body;

    // Kiểm tra link đã tồn tại chưa (nếu đang cập nhật link)
    if (link) {
      const existingTour = await Tour.findOne({ 
        link, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingTour) {
        return res.status(400).json({ message: 'Tour với link này đã tồn tại' });
      }
    }

    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id,
      { date, destination, title, image, description, link },
      { new: true }
    );

    if (!updatedTour) {
      return res.status(404).json({ message: 'Không tìm thấy tour' });
    }

    res.json(updatedTour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Xóa tour
// @route   DELETE /api/admin/tours/:id
// @access  Admin
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Không tìm thấy tour' });
    }

    // Xóa cả tour detail nếu có
    await TourDetail.findOneAndDelete({ tourId: tour.link });
    
    await tour.deleteOne();
    res.json({ message: 'Tour đã được xóa' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};