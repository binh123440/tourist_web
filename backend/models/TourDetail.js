const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: [{
    type: String,
    required: true
  }]
});

const tourDetailSchema = new mongoose.Schema({
  tourId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  intro: {
    type: String,
    required: true
  },
  days: [daySchema],
  images: [{
    image: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('TourDetail', tourDetailSchema);