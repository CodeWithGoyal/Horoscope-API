require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Routes
const authRoutes = require('./routes/auth');
const horoscopeRoutes = require('./routes/horoscope');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/horoscope', horoscopeRoutes);
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server first
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Try to connect to MongoDB (optional for now)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/horoscope-api')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.warn('MongoDB connection failed (server will still run):', error.message);
  });
