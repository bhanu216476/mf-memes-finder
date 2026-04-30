const express = require('express');
const router = express.Router();
const Audio = require('../models/Audio');

// Get all audios (or filter by packId)
router.get('/', async (req, res) => {
  try {
    const { packId } = req.query;
    let query = {};
    if (packId) query.packId = packId;
    
    const audios = await Audio.find(query).sort({ createdAt: -1 });
    res.json(audios);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
