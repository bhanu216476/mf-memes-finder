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
  { id: 'sunil',    label: 'Sunil',      img: 'https://i.postimg.cc/YG2PHpMQ/Whats-App-Image-2025-12-07-at-09-56-54-2a90bedc.jpg' },
  { id: 'brahmi',   label: 'Brahmi',     img: 'https://i.postimg.cc/Mnxb49Wk/Whats-App-Image-2025-12-07-at-09-56-52-4f67f9f0.jpg' },
  { id: 'ali',      label: 'Ali',        img: 'https://i.postimg.cc/HrpX3j2T/Whats-App-Image-2025-12-07-at-09-56-52-d056fb73.jpg' },
  { id: 'mohanlal', label: 'Mohanlal',   img: 'https://i.postimg.cc/WFJktZNp/Whats-App-Image-2025-12-07-at-09-56-53-e33a55c6.jpg' },
  { id: 'vk',       label: 'VK',         img: 'https://i.postimg.cc/HrZc2znR/Whats-App-Image-2025-12-07-at-09-56-53-eaf5d238.jpg' },
  { id: 'satya',    label: 'Satya',      img: 'https://i.postimg.cc/rz1DbMzf/Whats-App-Image-2025-12-07-at-09-56-54-32f0e1b4.jpg' },
];

const TEMPLATE_IMAGES = {
  sunil: [
    'https://i.postimg.cc/YG2PHpMQ/Whats-App-Image-2025-12-07-at-09-56-54-2a90bedc.jpg',
    'https://files.telugumemesounds.com/images/sunil.jpeg',
    'https://files.telugumemesounds.com/images/venu-madhav.jpeg',
    'https://files.telugumemesounds.com/images/dharmavarapu.jpeg',
    'https://files.telugumemesounds.com/images/vennela-kishore.jpeg',
    'https://files.telugumemesounds.com/images/allu-arjun.jpeg',
  ],
  brahmi: [
    'https://i.postimg.cc/Mnxb49Wk/Whats-App-Image-2025-12-07-at-09-56-52-4f67f9f0.jpg',
    'https://files.telugumemesounds.com/images/meme-god.jpeg',
    'https://files.telugumemesounds.com/images/bala-krishna.jpeg',
    'https://files.telugumemesounds.com/images/chiranjeevi.jpeg',
    'https://files.telugumemesounds.com/images/mahesh-babu.jpeg',
    'https://files.telugumemesounds.com/images/pawan-kalyan.jpeg',
  ],
  ali: [
    'https://i.postimg.cc/HrpX3j2T/Whats-App-Image-2025-12-07-at-09-56-52-d056fb73.jpg',
    'https://files.telugumemesounds.com/images/ali.jpeg',
    'https://files.telugumemesounds.com/images/ravi-teja.jpeg',
    'https://files.telugumemesounds.com/images/ntr.jpeg',
    'https://files.telugumemesounds.com/images/prabhas.jpeg',
    'https://files.telugumemesounds.com/images/samantha.jpeg',
  ],
  mohanlal: [
    'https://i.postimg.cc/WFJktZNp/Whats-App-Image-2025-12-07-at-09-56-53-e33a55c6.jpg',
    'https://files.telugumemesounds.com/images/venkatesh.jpeg',
    'https://files.telugumemesounds.com/images/nagarjuna.jpeg',
    'https://files.telugumemesounds.com/images/sunil.jpeg',
    'https://files.telugumemesounds.com/images/ali.jpeg',
    'https://files.telugumemesounds.com/images/meme-god.jpeg',
  ],
  vk: [
    'https://i.postimg.cc/HrZc2znR/Whats-App-Image-2025-12-07-at-09-56-53-eaf5d238.jpg',
    'https://files.telugumemesounds.com/images/venkatesh.jpeg',
    'https://files.telugumemesounds.com/images/bala-krishna.jpeg',
    'https://files.telugumemesounds.com/images/allu-arjun.jpeg',
    'https://files.telugumemesounds.com/images/mahesh-babu.jpeg',
    'https://files.telugumemesounds.com/images/pawan-kalyan.jpeg',
  ],
  satya: [
    'https://i.postimg.cc/rz1DbMzf/Whats-App-Image-2025-12-07-at-09-56-54-32f0e1b4.jpg',
    'https://files.telugumemesounds.com/images/venu-madhav.jpeg',
    'https://files.telugumemesounds.com/images/dharmavarapu.jpeg',
    'https://files.telugumemesounds.com/images/vennela-kishore.jpeg',
    'https://files.telugumemesounds.com/images/ravi-teja.jpeg',
    'https://files.telugumemesounds.com/images/prabhas.jpeg',
  ],
};

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

    // ── Seed Templates (from live memes.co.in or fallback) ───────────────────
    const templates = [];
    const CATEGORIES = ['sunil', 'brahmi', 'ali', 'mohanlal', 'vk', 'satya'];

    function getCategory(title, tags) {
      const t = (title + ' ' + (tags || []).join(' ')).toLowerCase();
      if (t.includes('sunil')) return 'sunil';
      if (t.includes('brahmi') || t.includes('brahmanandam') || t.includes('chari')) return 'brahmi';
      if (t.includes('ali')) return 'ali';
      if (t.includes('mohanlal')) return 'mohanlal';
      if (t.includes('vennela') || t.includes('kishore') || t.includes('vk ')) return 'vk';
      if (t.includes('satya') || t.includes('sathya')) return 'satya';
      return null;
    }

    try {
      console.log('Fetching live Tollywood meme templates from memes.co.in...');
      let rrIndex = 0;
      for (let page = 1; page <= 3; page++) {
        const url = `https://api.memes.co.in/api/content/filtered?category_id=168&content_type=memetemplate&page=${page}&page_size=100`;
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        if (res.status === 404) {
          break; // Page doesn't exist, stop fetching
        }
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        const results = data.results || [];
        if (results.length === 0) break;

        for (const item of results) {
          if (!item.image_path) continue;
          const cleanTitle = item.title ? item.title.replace(' Template', '').replace(' Meme', '').trim() : 'Meme Template';
          const imgUrl = `https://api.memes.co.in/media/${item.image_path}`;
          
          let catId = getCategory(item.title || '', item.tags_display || []);
          if (!catId) {
            catId = CATEGORIES[rrIndex % CATEGORIES.length];
            rrIndex++;
          }

          templates.push({
            title: cleanTitle,
            categoryId: catId,
            imgSrc: imgUrl,
            isTrending: item.no_of_views > 500
          });
        }
      }
    } catch (err) {
      console.warn('⚠️ Could not fetch live Tollywood templates, using fallback:', err.message);
    }

    if (templates.length > 0) {
      await Template.insertMany(templates);
      console.log(`🖼️  Templates seeded: ${templates.length} real Tollywood entries from memes.co.in`);
    } else {
      TEMPLATE_CATEGORIES.forEach(cat => {
        const imgs = TEMPLATE_IMAGES[cat.id] || [];
        for (let i = 1; i <= 6; i++) {
          const imgSrc = imgs[i - 1] || cat.img;
          templates.push({
            title: `${cat.label} Template ${i}`,
            categoryId: cat.id,
            imgSrc,
            isTrending: i <= 2,
          });
        }
      });
      await Template.insertMany(templates);
      console.log(`🖼️  Templates seeded: ${templates.length} fallback dummy entries`);
    }


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
