const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const activityRoutes = require('./routes/activity');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/time_tracking_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/activity', activityRoutes);

// Dummy POST handler (optional — remove if logic is in activityRoutes)
app.post('/api/activity/track', (req, res) => {
  console.log('Activity received directly in server.js:', req.body);
  res.json({ message: 'Activity logged successfully' });
});

// Optional: Weekly report dummy data
app.get('/api/report', (req, res) => {
  res.json({
    google: 120,
    youtube: 300,
    github: 90
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
