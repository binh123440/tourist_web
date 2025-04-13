const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  url: {
    type: String,  // Đây là Cloudinary secure_url
    required: true
  },
  cloudinaryId: {
    type: String    // Đây là Cloudinary public_id
  },
  type: {
    type: String,
    enum: ['gallery', 'tour', 'destination'],
    default: 'gallery'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Image', imageSchema);