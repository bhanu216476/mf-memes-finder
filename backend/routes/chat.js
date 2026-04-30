const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// Get all chat messages
router.get('/', async (req, res) => {
  try {
    const messages = await Chat.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Send a new chat message
router.post('/', async (req, res) => {
  try {
    const { from, text, userId } = req.body;
    const newMessage = new Chat({ from, text, userId });
    await newMessage.save();
    res.json(newMessage);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
