const mongoose = require('mongoose');

const DaySchema = new mongoose.Schema({
  title: {
    vi: { type: String, required: true, default: '' },
    en: { type: String, default: '' },
    fr: { type: String, default: '' }
  },
  content: [{ // Array of content items, each is an object with languages
    vi: { type: String, default: '' },
    en: { type: String, default: '' },
    fr: { type: String, default: '' }
  }]
}, { _id: false }); // Prevent Mongoose from creating _id for subdocuments if not needed

const ImageSchema = new mongoose.Schema({
  image: { type: String, required: true }, // URL remains a single string
  alt: { // Alt text becomes multi-language
    vi: { type: String, default: '' },
    en: { type: String, default: '' },
    fr: { type: String, default: '' }
  }
}, { _id: false }); // Prevent Mongoose from creating _id for subdocuments if not needed

const TourDetailSchema = new mongoose.Schema({
  tourId: { type: String, required: true, unique: true }, // Link from Tour model (using tour.link)
  createdAt: { type: Date, default: Date.now },

  // Modify translatable fields
  title: {
    vi: { type: String, required: true, default: '' },
    en: { type: String, default: '' },
    fr: { type: String, default: '' }
  },
  intro: {
    vi: { type: String, default: '' },
    en: { type: String, default: '' },
    fr: { type: String, default: '' }
  },
  days: [DaySchema], // Use the nested DaySchema
  images: [ImageSchema] // Use the nested ImageSchema
});

module.exports = mongoose.model('TourDetail', TourDetailSchema);