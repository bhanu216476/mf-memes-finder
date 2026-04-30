require('dotenv').config();
const mongoose = require('mongoose');
const Chat = require('./models/Chat');
const Template = require('./models/Template');
const Audio = require('./models/Audio');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/memesfinder';

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for seeding');

    // Clear existing
    await Chat.deleteMany({});
    await Template.deleteMany({});
    await Audio.deleteMany({});

    // Seed Chat
    await Chat.insertMany([
      { from: 'admin', text: 'Tell me which actor / scene you need, I will add that template pack.' },
      { from: 'user', text: 'Need more Sunil temple comedy templates 🙏' }
    ]);

    // Seed Templates (using dummy placeholders to mimic existing ones)
    const templates = [];
    const categories = ['sunil', 'brahmi', 'ali', 'mohanlal', 'vk', 'satya'];
    categories.forEach(cat => {
      for (let i = 1; i <= 6; i++) {
        templates.push({
          title: `${cat.toUpperCase()} Template ${i}`,
          categoryId: cat,
          imgSrc: 'https://i.postimg.cc/tC1YN2FC/Whats-App-Image-2025-11-25-at-14-37-13-adbd1118.jpg' // Using a placeholder from frontend
        });
      }
    });
    await Template.insertMany(templates);

    // Seed Audio
    const audios = [];
    for(let i=1; i<=6; i++) {
        for(let j=1; j<=5; j++) {
            audios.push({
                title: `Audio Track ${j}`,
                packId: `audio${i}`,
                duration: '0:30'
            });
        }
    }
    await Audio.insertMany(audios);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
