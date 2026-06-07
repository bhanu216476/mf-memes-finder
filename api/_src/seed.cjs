require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Chat = require('./models/Chat.cjs');
const Template = require('./models/Template.cjs');
const Audio = require('./models/Audio.cjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/memesfinder';

// ─── Load live data snapshots ─────────────────────────────────────────────────
const tmsAudiosPath = path.join(__dirname, '../../../..', 'scratch', 'tms_audios.json');
let liveAudios = [];
try {
  const raw = fs.readFileSync(tmsAudiosPath, 'utf-8');
  const parsed = JSON.parse(raw);
  liveAudios = parsed.data || [];
  console.log(`✅ Loaded ${liveAudios.length} live audio entries from TMS snapshot`);
} catch (e) {
  console.warn('⚠️  Could not load tms_audios.json, using fallback data:', e.message);
}

// ─── Fallback / template data ─────────────────────────────────────────────────
const TEMPLATE_CATEGORIES = [
  { id: 'sunil',    label: 'Sunil',      img: 'https://i.postimg.cc/tC1YN2FC/Whats-App-Image-2025-11-25-at-14-37-13-adbd1118.jpg' },
  { id: 'brahmi',   label: 'Brahmi',     img: 'https://i.postimg.cc/tC1YN2FC/Whats-App-Image-2025-11-25-at-14-37-13-adbd1118.jpg' },
  { id: 'ali',      label: 'Ali',        img: 'https://i.postimg.cc/tC1YN2FC/Whats-App-Image-2025-11-25-at-14-37-13-adbd1118.jpg' },
  { id: 'mohanlal', label: 'Mohanlal',   img: 'https://i.postimg.cc/tC1YN2FC/Whats-App-Image-2025-11-25-at-14-37-13-adbd1118.jpg' },
  { id: 'vk',       label: 'VK',         img: 'https://i.postimg.cc/tC1YN2FC/Whats-App-Image-2025-11-25-at-14-37-13-adbd1118.jpg' },
  { id: 'satya',    label: 'Satya',      img: 'https://i.postimg.cc/tC1YN2FC/Whats-App-Image-2025-11-25-at-14-37-13-adbd1118.jpg' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected for seeding');

    // ── Clear existing data ──────────────────────────────────────────────────
    await Chat.deleteMany({});
    await Template.deleteMany({});
    await Audio.deleteMany({});
    console.log('🗑️  Cleared existing collections');

    // ── Seed Chat ────────────────────────────────────────────────────────────
    await Chat.insertMany([
      { from: 'admin', text: 'Tell me which actor / scene you need, I will add that template pack.' },
      { from: 'user',  text: 'Need more Sunil temple comedy templates 🙏' },
      { from: 'admin', text: 'Added! Check the Sunil section now.' },
    ]);
    console.log('💬 Chat seeded');

    // ── Seed Templates ───────────────────────────────────────────────────────
    const templates = [];
    TEMPLATE_CATEGORIES.forEach(cat => {
      for (let i = 1; i <= 6; i++) {
        templates.push({
          title: `${cat.label} Template ${i}`,
          categoryId: cat.id,
          imgSrc: cat.img,
          isTrending: i <= 2,
        });
      }
    });
    await Template.insertMany(templates);
    console.log(`🖼️  Templates seeded: ${templates.length} entries`);

    // ── Seed Audio (from live TMS data or fallback) ─────────────────────────
    if (liveAudios.length > 0) {
      const audioRecords = liveAudios.slice(0, 500).map(a => ({
        title:         a.title || 'Untitled',
        slug:          a.slug  || '',
        description:   a.description || '',
        audioUrl:      a.audioUrl  || '',
        thumbnailUrl:  a.thumbnailUrl || '',
        playCount:     a.playCount || 0,
        downloadCount: a.downloadCount || 0,
        likeCount:     a.likeCount || 0,
        shareCount:    a.shareCount || 0,
        categories:    a.categories || [],
        tags:          a.tags || [],
        user:          a.user || { name: 'Unknown', username: 'unknown' },
        externalId:    a.id || '',
        packId:        (a.categories && a.categories[0]) ? a.categories[0].slug : 'general',
        isTrending:    (a.shareCount || 0) > 1000 || (a.playCount || 0) > 5000,
        duration:      '0:30',
      }));
      await Audio.insertMany(audioRecords);
      console.log(`🎵 Audio seeded: ${audioRecords.length} entries from live TMS data`);
    } else {
      // Fallback dummy audio
      const audios = [];
      for (let i = 1; i <= 6; i++) {
        for (let j = 1; j <= 5; j++) {
          audios.push({ title: `Audio Track ${j}`, packId: `audio${i}`, duration: '0:30' });
        }
      }
      await Audio.insertMany(audios);
      console.log(`🎵 Audio seeded: ${audios.length} fallback entries`);
    }

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedDB();
