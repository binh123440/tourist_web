const Image = require('../../models/Image');
const cloudinary = require('../../config/cloudinary');
const fs = require('fs');
const path = require('path');

// @desc    Lấy tất cả ảnh (bao gồm cả filter theo trạng thái xóa)
// @route   GET /api/admin/gallery
// @access  Admin
exports.getImages = async (req, res) => {
  try {
    const { type, deleted } = req.query;
    let query = {};
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    // Thêm filter theo trạng thái xóa
    if (deleted === 'true') {
      query.isDeleted = true;
    } else if (deleted === 'false' || !deleted) {
      query.isDeleted = false;
    }
    
    const images = await Image.find(query).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Lấy ảnh theo id
// @route   GET /api/admin/gallery/:id
// @access  Admin
exports.getImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Không tìm thấy ảnh' });
    }
    res.json(image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Upload image
// @route   POST /api/admin/gallery
// @access  Admin
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng chọn ảnh để upload' });
    }

    // Upload lên Cloudinary với folder dựa vào loại
    const type = req.body.type || 'gallery';
    const folderMap = {
      'gallery': 'Gallery_LotusVoyages',
      'tour': 'Tour_LotusVoyages',
    };
    
    const folder = folderMap[type] || 'Gallery_LotusVoyages';
    
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folder,
      resource_type: 'image'
    });

    // Xóa file tạm sau khi upload lên Cloudinary
    fs.unlinkSync(req.file.path);

    const newImage = new Image({
      name: req.body.name || req.file.originalname,
      description: req.body.description || '',
      url: result.secure_url, // URL từ Cloudinary
      cloudinaryId: result.public_id, // ID để quản lý trên Cloudinary
      type: type
    });

    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Cập nhật thông tin ảnh
// @route   PUT /api/admin/gallery/:id
// @access  Admin
exports.updateImage = async (req, res) => {
  try {
    const { name, description, type } = req.body;

    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Không tìm thấy ảnh' });
    }

    if (name) image.name = name;
    if (description) image.description = description;
    if (type) image.type = type;

    const updatedImage = await image.save();
    res.json(updatedImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Xóa mềm ảnh
// @route   PUT /api/admin/gallery/:id/soft-delete
// @access  Admin
exports.softDeleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Không tìm thấy ảnh' });
    }

    // Thực hiện xóa mềm
    image.isDeleted = true;
    await image.save();

    res.json({ message: 'Ảnh đã được xóa tạm thời và có thể khôi phục' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Khôi phục ảnh đã xóa mềm
// @route   PUT /api/admin/gallery/:id/restore
// @access  Admin
exports.restoreImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Không tìm thấy ảnh' });
    }

    image.isDeleted = false;
    await image.save();

    res.json({ message: 'Ảnh đã được khôi phục thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Xóa vĩnh viễn ảnh
// @route   DELETE /api/admin/gallery/:id/permanent
// @access  Admin
exports.permanentDeleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Không tìm thấy ảnh' });
    }

    // Nếu có cloudinaryId, xóa ảnh từ Cloudinary
    if (image.cloudinaryId) {
      await cloudinary.uploader.destroy(image.cloudinaryId);
    }

    // Xóa hoàn toàn khỏi database
    await Image.deleteOne({ _id: image._id });
    res.json({ message: 'Ảnh đã được xóa vĩnh viễn' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Delete image (chức năng cũ, giờ chuyển sang xóa mềm)
// @route   DELETE /api/admin/gallery/:id
// @access  Admin
exports.deleteImage = async (req, res) => {
  try {
    // Giờ sẽ luôn chuyển hướng sang xóa mềm
    return await exports.softDeleteImage(req, res);
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};