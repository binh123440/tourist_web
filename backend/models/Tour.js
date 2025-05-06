const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
  // Keep non-translatable fields as they are
  date: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },

  // Modify translatable fields
  title: {
    vi: { type: String, required: true, default: '' },
    en: { type: String, default: '' },
    fr: { type: String, default: '' }
  },
  destination: {
    vi: { type: String, required: true, default: '' },
    en: { type: String, default: '' },
    fr: { type: String, default: '' }
  },
  description: {
    vi: { type: String, required: true, default: '' },
    en: { type: String, default: '' },
    fr: { type: String, default: '' }
  }
});

module.exports = mongoose.model('Tour', TourSchema);