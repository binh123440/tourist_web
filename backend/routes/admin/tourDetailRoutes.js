const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
  getTourDetails,
  getTourDetail,
  createTourDetail,
  updateTourDetail,
  deleteTourDetail
} = require('../../controllers/admin/tourDetailController');

// @route   GET /api/admin/tour-details
// @desc    Lấy tất cả chi tiết tour
// @access  Admin
router.get('/', auth, getTourDetails);

// @route   GET /api/admin/tour-details/:id
// @desc    Lấy chi tiết tour theo id
// @access  Admin
router.get('/:id', auth, getTourDetail);

// @route   POST /api/admin/tour-details
// @desc    Tạo chi tiết tour mới
// @access  Admin
router.post('/', auth, createTourDetail);

// @route   PUT /api/admin/tour-details/:id
// @desc    Cập nhật chi tiết tour
// @access  Admin
router.put('/:id', auth, updateTourDetail);

// @route   DELETE /api/admin/tour-details/:id
// @desc    Xóa chi tiết tour
// @access  Admin
router.delete('/:id', auth, deleteTourDetail);

module.exports = router;