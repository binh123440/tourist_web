const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST /api/auth/login
// @desc    Đăng nhập
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Lấy thông tin người dùng
// @access  Private
router.get('/me', auth, getMe);

module.exports = router;