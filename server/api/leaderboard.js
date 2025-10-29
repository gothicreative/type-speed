const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscription: { 
    type: String, 
    enum: ['free', 'pro', 'trainer'], 
    default: 'free' 
  },
  wpm: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  testsTaken: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Get leaderboard - top users by WPM
app.get('/leaderboard', async (req, res) => {
  try {
    // Connect to MongoDB
    let dbConnected = false;
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/speedtype', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      dbConnected = true;
    } catch (error) {
      console.log(`MongoDB connection failed: ${error.message}`);
      console.log('Running in mock mode without database');
      dbConnected = false;
    }
    
    if (dbConnected) {
      // Get top 10 users by WPM
      const users = await User.find({ wpm: { $gt: 0 } })
        .sort({ wpm: -1 })
        .limit(10)
        .select('username wpm accuracy testsTaken subscription');
      
      res.status(200).json({ users });
    } else {
      // Mock data for leaderboard
      res.status(200).json({
        users: [
          { username: 'SpeedDemon', wpm: 120, accuracy: 98, testsTaken: 50, subscription: 'trainer' },
          { username: 'TypingMaster', wpm: 110, accuracy: 96, testsTaken: 45, subscription: 'pro' },
          { username: 'KeyboardKing', wpm: 100, accuracy: 95, testsTaken: 40, subscription: 'pro' },
          { username: 'FastFingers', wpm: 90, accuracy: 93, testsTaken: 35, subscription: 'free' },
          { username: 'TypeRacer', wpm: 85, accuracy: 92, testsTaken: 30, subscription: 'free' }
        ]
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = app;