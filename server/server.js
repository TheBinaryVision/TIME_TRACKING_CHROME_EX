const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');
require('dotenv').config();
app.use('/api/activity', activityRoutes);
const activityRoutes = require('./routes/activity');

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/time_tracking_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

  // MongoDB connection (already working)
mongoose.connect(process.env.MONGO_URI || 'your_mongodb_uri_here', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

// 👇 Use activity routes
const activityRoutes = require('./routes/activity');
app.use('/api/activity', activityRoutes);

// Your activity tracking route
app.post('/api/activity/track', (req, res) => {
  console.log('Activity received:', req.body);

  // You can add database saving logic here later
  res.json({ message: 'Activity logged successfully' });
});

// Optional: weekly report route
app.get('/api/report', (req, res) => {
  // Just returning dummy data for now
  res.json({
    google: 120,
    youtube: 300,
    github: 90
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
