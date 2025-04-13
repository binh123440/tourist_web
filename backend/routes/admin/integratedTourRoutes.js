const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
  getTours,
  getTourWithDetail,
  createOrUpdateTour,
  deleteTour
} = require('../../controllers/admin/integratedTourController');

// @route   GET /api/admin/integrated-tours
// @desc    Lấy tất cả tours với chi tiết
// @access  Admin
router.get('/', auth, getTours);

// @route   GET /api/admin/integrated-tours/:id
// @desc    Lấy tour và chi tiết theo id của tour
// @access  Admin
router.get('/:id', auth, getTourWithDetail);

// @route   POST /api/admin/integrated-tours
// @desc    Tạo hoặc cập nhật tour với chi tiết
// @access  Admin
router.post('/', auth, createOrUpdateTour);

// @route   DELETE /api/admin/integrated-tours/:id
// @desc    Xóa tour và chi tiết tour
// @access  Admin
router.delete('/:id', auth, deleteTour);

module.exports = router;