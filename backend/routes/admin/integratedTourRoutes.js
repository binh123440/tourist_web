const express = require('express');
const router = express.Router();
const {
  createOrUpdateTour, // Giữ lại cho POST
  getTours,
  getTourWithDetail, // Đổi tên hàm nếu cần
  deleteTour, // Đổi tên hàm nếu cần
  updateIntegratedTour // <--- Import hàm mới
} = require('../../controllers/admin/integratedTourController');
const authAdmin = require('../../middleware/auth');

// GET all integrated tours
router.get('/', authAdmin, getTours);

// GET single integrated tour by Tour ID
router.get('/:id', authAdmin, getTourWithDetail);

// POST create integrated tour
router.post('/', authAdmin, createOrUpdateTour); // Route này chỉ dùng để tạo mới

// PUT update integrated tour by Tour ID <--- SỬA HOẶC THÊM DÒNG NÀY
router.put('/:id', authAdmin, updateIntegratedTour); // Trỏ đến hàm mới

// DELETE integrated tour by Tour ID
router.delete('/:id', authAdmin, deleteTour);

module.exports = router;