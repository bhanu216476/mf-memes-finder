const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  categoryId: {
    type: String,
    required: true
  },
  imgSrc: {
    type: String,
    required: true
  },
  isTrending: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Template', TemplateSchema);
