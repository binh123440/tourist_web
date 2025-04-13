// scripts/importCloudinaryImages.js
const cloudinary = require('../config/cloudinary');
const Image = require('../models/Image');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Kết nối database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const importImages = async () => {
  try {
    // Lấy tất cả ảnh từ thư mục 'gallery' trong Cloudinary
    const result = await cloudinary.search
      .expression('folder:Lotus_Voyages') // thay đổi folder nếu cần
      .sort_by('created_at', 'desc')
      .max_results(500) // tăng số lượng nếu bạn có nhiều ảnh
      .execute();

    console.log(`Tìm thấy ${result.resources.length} ảnh trên Cloudinary`);

    // Thêm từng ảnh vào database
    let count = 0;
    for (const resource of result.resources) {
      // Kiểm tra xem ảnh đã tồn tại trong database chưa
      const existingImage = await Image.findOne({ cloudinaryId: resource.public_id });
      
      if (!existingImage) {
        // Tạo record mới trong database
        const newImage = new Image({
          name: resource.public_id.split('/').pop() || 'Cloudinary Image',
          description: 'Imported from Cloudinary',
          url: resource.secure_url,
          cloudinaryId: resource.public_id,
          type: 'gallery'
        });
        
        await newImage.save();
        count++;
        console.log(`Đã thêm ảnh: ${resource.public_id}`);
      }
    }

    console.log(`Đã thêm ${count} ảnh mới vào database`);
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi import ảnh:', error);
    process.exit(1);
  }
};

importImages();