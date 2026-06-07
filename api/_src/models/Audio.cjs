const mongoose = require('mongoose');

const AudioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String },
  description: { type: String, default: '' },
  audioUrl: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  playCount: { type: Number, default: 0 },
  downloadCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  shareCount: { type: Number, default: 0 },
  // Legacy fields for backward compatibility
  packId: { type: String, default: '' },
  duration: { type: String, default: '0:30' },
  isTrending: { type: Boolean, default: false },
  categories: [{ name: String, slug: String, imageUrl: String }],
  tags: [{ name: String }],
  user: { name: String, username: String },
  externalId: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Audio', AudioSchema);
