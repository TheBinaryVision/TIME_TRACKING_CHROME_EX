const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity'); // A Mongoose model

router.post('/track', async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.json({ message: 'Activity saved to DB!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save activity' });
  }
});

module.exports = router;
