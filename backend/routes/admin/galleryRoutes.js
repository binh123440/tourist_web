const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
  getImages,
  getImage,
  uploadImage,
  updateImage,
  deleteImage,
  softDeleteImage,
  restoreImage,
  permanentDeleteImage
} = require('../../controllers/admin/galleryController');
const upload = require('../../middleware/upload');

// @route   GET /api/admin/gallery
// @desc    Lấy tất cả ảnh
// @access  Admin
router.get('/', auth, getImages);

// @route   GET /api/admin/gallery/:id
// @desc    Lấy ảnh theo id
// @access  Admin
router.get('/:id', auth, getImage);

// @route   POST /api/admin/gallery
// @desc    Upload ảnh mới
// @access  Admin
router.post('/', auth, upload.single('image'), uploadImage);

// @route   PUT /api/admin/gallery/:id
// @desc    Cập nhật thông tin ảnh
// @access  Admin
router.put('/:id', auth, updateImage);

// @route   PUT /api/admin/gallery/:id/soft-delete
// @desc    Xóa mềm ảnh
// @access  Admin
router.put('/:id/soft-delete', auth, softDeleteImage);

// @route   PUT /api/admin/gallery/:id/restore
// @desc    Khôi phục ảnh đã xóa mềm
// @access  Admin
router.put('/:id/restore', auth, restoreImage);

// @route   DELETE /api/admin/gallery/:id/permanent
// @desc    Xóa vĩnh viễn ảnh
// @access  Admin
router.delete('/:id/permanent', auth, permanentDeleteImage);

// @route   DELETE /api/admin/gallery/:id
// @desc    Xóa mềm ảnh (giữ compatibility)
// @access  Admin
router.delete('/:id', auth, deleteImage);

module.exports = router;