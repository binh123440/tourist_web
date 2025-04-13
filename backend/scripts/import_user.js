// backend/scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Thông tin tài khoản admin mới
const createAdmin = async () => {
  try {
    // Kiểm tra xem username đã tồn tại chưa
    const adminUsername = process.argv[2] || 'lotusvoyages';
    const adminPassword = process.argv[3] || 'lotusvoyages123440';
    
    const userExists = await User.findOne({ username: adminUsername });
    
    if (userExists) {
      console.log(`Tài khoản với username '${adminUsername}' đã tồn tại!`);
      process.exit(0);
    }
    
    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    // Tạo admin mới
    const newAdmin = new User({
      username: adminUsername,
      password: hashedPassword,
      isAdmin: true
    });
    
    // Lưu vào database
    await newAdmin.save();
    
    console.log(`Đã tạo tài khoản admin thành công:`);
    console.log(`- Username: ${adminUsername}`);
    console.log(`- Password: ${adminPassword}`);
    console.log('Hãy đổi mật khẩu sau khi đăng nhập lần đầu!');
    
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi tạo tài khoản admin:', error);
    process.exit(1);
  }
};

createAdmin();