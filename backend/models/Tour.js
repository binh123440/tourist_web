const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tour', tourSchema);