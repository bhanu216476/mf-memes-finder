const express = require('express');
const router = express.Router();
const Audio = require('../models/Audio.cjs');

// GET /api/audio  — list with filtering, search, pagination
router.get('/', async (req, res) => {
  try {
    const {
      packId,
      categorySlug,
      search,
      trending,
      page = 1,
      limit = 20,
    } = req.query;

    let query = {};

    if (packId)        query.packId        = packId;
    if (categorySlug)  query['categories.slug'] = categorySlug;
    if (trending === 'true') query.isTrending = true;
    if (search) {
      query.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'tags.name': { $regex: search, $options: 'i' } },
      ];
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Audio.countDocuments(query);
    const audios = await Audio.find(query)
      .sort({ shareCount: -1, playCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), data: audios });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/audio/trending  — top trending sounds
router.get('/trending', async (req, res) => {
  try {
    const audios = await Audio.find({ isTrending: true })
      .sort({ shareCount: -1, playCount: -1 })
      .limit(20);
    res.json({ success: true, data: audios });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/audio/categories  — distinct categories
router.get('/categories', async (req, res) => {
  try {
    const cats = await Audio.aggregate([
      { $unwind: '$categories' },
      { $group: { _id: '$categories.slug', name: { $first: '$categories.name' }, imageUrl: { $first: '$categories.imageUrl' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ success: true, data: cats });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/audio/:id  — single audio by MongoDB _id or externalId
router.get('/:id', async (req, res) => {
  try {
    const audio = await Audio.findOne({
      $or: [{ _id: req.params.id }, { externalId: req.params.id }],
    });
    if (!audio) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data: audio });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/audio/:id/play  — increment play count
router.patch('/:id/play', async (req, res) => {
  try {
    const audio = await Audio.findByIdAndUpdate(
      req.params.id,
      { $inc: { playCount: 1 } },
      { new: true }
    );
    res.json({ success: true, playCount: audio.playCount });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
