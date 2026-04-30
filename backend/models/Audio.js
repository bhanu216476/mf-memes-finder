const mongoose = require('mongoose');

const AudioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  packId: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  isTrending: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Audio', AudioSchema);
