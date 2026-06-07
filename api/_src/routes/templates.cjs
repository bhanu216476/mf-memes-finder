const express = require('express');
const router = express.Router();
const Template = require('../models/Template.cjs');

// GET /api/templates  — list with filtering, search, pagination
router.get('/', async (req, res) => {
  try {
    const { categoryId, search, trending, page = 1, limit = 20 } = req.query;

    let query = {};
    if (categoryId) query.categoryId = categoryId;
    if (trending === 'true') query.isTrending = true;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Template.countDocuments(query);
    const templates = await Template.find(query)
      .sort({ isTrending: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), data: templates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/templates/categories  — distinct template categories
router.get('/categories', async (req, res) => {
  try {
    const cats = await Template.aggregate([
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ success: true, data: cats });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/templates/:id
router.get('/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data: template });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/templates/upload  — add new template
router.post('/upload', async (req, res) => {
  try {
    const { title, categoryId, imgSrc } = req.body;
    if (!title || !categoryId || !imgSrc)
      return res.status(400).json({ error: 'title, categoryId and imgSrc are required' });
    const newTemplate = new Template({ title, categoryId, imgSrc });
    await newTemplate.save();
    res.json({ success: true, data: newTemplate });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
