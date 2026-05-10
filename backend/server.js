const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Robust MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error: ', err));
} else {
  console.warn('⚠️ MONGO_URI missing. Backend will run in fallback (volatile) mode.');
}

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/audio', require('./routes/audio'));
app.use('/api/chat', require('./routes/chat'));

// Fallback for 404
app.use('/api/*', (req, res) => res.status(404).json({ error: 'Endpoint not found' }));

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
}

module.exports = app;
