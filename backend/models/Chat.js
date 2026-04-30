const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  from: {
    type: String, // 'user' or 'admin'
    required: true
  },
  text: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional: allows anonymous chat for simplicity in this demo
  }
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);
