const express = require('express');
const TimeData = require('../models/TimeData');
const Activity = require('../models/Activity');
const router = express.Router();

// Route to track time spent on a website
router.post('/track/time', async (req, res) => {
  try {
    const { domain, timeSpent } = req.body;

    const newTimeData = new TimeData({
      domain,
      timeSpent,
      date: new Date()
    });

    await newTimeData.save();
    res.status(200).json({ message: 'Time data saved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get the weekly productivity report
router.get('/report', async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Get the date 7 days ago

    const timeData = await TimeData.find({
      date: { $gte: startDate }
    });

    let productiveTime = 0;
    let unproductiveTime = 0;

    timeData.forEach((data) => {
      if (data.domain.includes('coding') || data.domain.includes('project')) {
        productiveTime += data.timeSpent;
      } else {
        unproductiveTime += data.timeSpent;
      }
    });

    const report = {
      productiveTime,
      unproductiveTime,
      totalTime: productiveTime + unproductiveTime,
    };

    res.status(200).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST route to save activity data
router.post('/track/activity', async (req, res) => {
  try {
    const newActivity = new Activity(req.body);
    await newActivity.save();
    res.status(201).json({ message: 'Activity saved!' });
  } catch (error) {
    console.error('Error saving activity:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST route to save activity data (alternative endpoint)
router.post('/track/activity/alternative', async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.json({ message: 'Activity saved to DB!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save activity' });
  }
});

module.exports = router;
