const mongoose = require('mongoose');
const Tour = require('../../models/Tour');
const TourDetail = require('../../models/TourDetail');

// @desc    Lấy tất cả tours với chi tiết nếu có
// @route   GET /api/admin/integrated-tours
// @access  Admin
exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find().sort({ createdAt: -1 });
    
    // Lấy chi tiết tour cho mỗi tour nếu có
    const toursWithDetails = await Promise.all(
      tours.map(async (tour) => {
        const tourDetail = await TourDetail.findOne({ tourId: tour.link });
        return {
          ...tour._doc,
          hasDetail: !!tourDetail,
          detailId: tourDetail ? tourDetail._id : null
        };
      })
    );
    
    res.json(toursWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Lấy tour và chi tiết theo id của tour
// @route   GET /api/admin/integrated-tours/:id
// @access  Admin
exports.getTourWithDetail = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Không tìm thấy tour' });
    }
    
    const tourDetail = await TourDetail.findOne({ tourId: tour.link });
    
    res.json({
      tour,
      detail: tourDetail || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Tạo hoặc cập nhật tour với chi tiết
// @route   POST /api/admin/integrated-tours
// @access  Admin
exports.createOrUpdateTour = async (req, res) => {
  try {
    const { tour: tourData, detail: detailData } = req.body;
    let savedTour, savedDetail;
    
    // Xử lý transaction (nếu một thao tác thất bại, hoàn tác thao tác còn lại)
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      if (tourData._id) {
        // Cập nhật tour hiện có
        const updatedTour = await Tour.findByIdAndUpdate(
          tourData._id,
          {
            title: tourData.title,
            destination: tourData.destination,
            date: tourData.date,
            image: tourData.image,
            description: tourData.description,
            link: tourData.link
          },
          { new: true, session }
        );
        
        if (!updatedTour) {
          throw new Error('Không tìm thấy tour để cập nhật');
        }
        
        savedTour = updatedTour;
      } else {
        // Kiểm tra link đã tồn tại chưa
        const existingTour = await Tour.findOne({ link: tourData.link });
        if (existingTour) {
          throw new Error('Tour với link này đã tồn tại');
        }
        
        // Tạo tour mới
        const newTour = new Tour({
          title: tourData.title,
          destination: tourData.destination,
          date: tourData.date,
          image: tourData.image,
          description: tourData.description,
          link: tourData.link
        });
        
        savedTour = await newTour.save({ session });
      }
      
      // Xử lý chi tiết tour
      if (detailData) {
        if (detailData._id) {
          // Cập nhật chi tiết tour hiện có
          const updatedDetail = await TourDetail.findByIdAndUpdate(
            detailData._id,
            {
              tourId: savedTour.link,
              title: detailData.title,
              intro: detailData.intro,
              days: detailData.days,
              images: detailData.images
            },
            { new: true, session }
          );
          
          savedDetail = updatedDetail;
        } else {
          // Kiểm tra chi tiết tour đã tồn tại chưa
          const existingDetail = await TourDetail.findOne({ tourId: savedTour.link });
          
          if (existingDetail) {
            // Cập nhật chi tiết tour hiện có
            existingDetail.title = detailData.title;
            existingDetail.intro = detailData.intro;
            existingDetail.days = detailData.days;
            existingDetail.images = detailData.images;
            
            savedDetail = await existingDetail.save({ session });
          } else {
            // Tạo chi tiết tour mới
            const newDetail = new TourDetail({
              tourId: savedTour.link,
              title: detailData.title,
              intro: detailData.intro,
              days: detailData.days || [],
              images: detailData.images || []
            });
            
            savedDetail = await newDetail.save({ session });
          }
        }
      }
      
      await session.commitTransaction();
      
      res.status(201).json({
        tour: savedTour,
        detail: savedDetail
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || 'Lỗi khi lưu tour' });
  }
};

// @desc    Xóa tour và chi tiết tour
// @route   DELETE /api/admin/integrated-tours/:id
// @access  Admin
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Không tìm thấy tour' });
    }
    
    // Xóa cả tour và chi tiết tour trong một transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      await TourDetail.findOneAndDelete({ tourId: tour.link }, { session });
      await tour.deleteOne({ session });
      
      await session.commitTransaction();
      res.json({ message: 'Tour và chi tiết đã được xóa thành công' });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};