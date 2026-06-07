const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://127.0.0.1:27017/memesfinder';

async function testConnection() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('MongoDB is running and connected successfully!');
    process.exit(0);
  } catch (err) {
    console.error('MongoDB is NOT running or could not connect:', err.message);
    process.exit(1);
  }
}

testConnection();
