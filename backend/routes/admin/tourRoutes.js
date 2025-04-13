const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour
} = require('../../controllers/admin/tourController');

// @route   GET /api/admin/tours
// @desc    Lấy tất cả tours
// @access  Admin
router.get('/', auth, getTours);

// @route   GET /api/admin/tours/:id
// @desc    Lấy tour theo id
// @access  Admin
router.get('/:id', auth, getTour);

// @route   POST /api/admin/tours
// @desc    Tạo tour mới
// @access  Admin
router.post('/', auth, createTour);

// @route   PUT /api/admin/tours/:id
// @desc    Cập nhật tour
// @access  Admin
router.put('/:id', auth, updateTour);

// @route   DELETE /api/admin/tours/:id
// @desc    Xóa tour
// @access  Admin
router.delete('/:id', auth, deleteTour);

module.exports = router;