const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: false
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    required: false
  },
  savedTemplates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template'
  }],
  savedAudios: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Audio'
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
