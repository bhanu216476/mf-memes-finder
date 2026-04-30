const express = require('express');
const router = express.Router();
const Template = require('../models/Template');

// Get all templates (or filter by categoryId)
router.get('/', async (req, res) => {
  try {
    const { categoryId } = req.query;
    let query = {};
    if (categoryId) query.categoryId = categoryId;
    
    const templates = await Template.find(query).sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Add new template (upload simulation)
router.post('/upload', async (req, res) => {
  try {
    const { title, categoryId, imgSrc } = req.body;
    const newTemplate = new Template({ title, categoryId, imgSrc });
    await newTemplate.save();
    res.json(newTemplate);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
