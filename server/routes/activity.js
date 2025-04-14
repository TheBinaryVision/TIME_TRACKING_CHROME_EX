const express = require('express');
const router = express.Router();

// POST /api/activity/track
router.post('/track', (req, res) => {
  console.log('✅ Activity received:', req.body);
  
  // Save to DB logic goes here (optional)
  
  res.json({ message: 'Activity logged successfully' });
});

module.exports = router;
