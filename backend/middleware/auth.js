const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Lấy token từ header
    const token = req.header('x-auth-token');
    
    // Kiểm tra nếu không có token
    if (!token) {
      return res.status(401).json({ message: 'Không có token, quyền truy cập bị từ chối' });
    }
    
    // Xác minh token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

module.exports = auth;