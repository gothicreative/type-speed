const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

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

// Typing Test Result Schema
const testResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
  textLength: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TestResult = mongoose.model('TestResult', testResultSchema);

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mock-secret');
      
      // Get user from token
      req.user = await User.findById(decoded.userId).select('-password');
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Get user stats
app.get('/users/:userId/stats', async (req, res) => {
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
    
    const { userId } = req.params;
    
    if (dbConnected) {
      // Find user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Get recent test results (last 5)
      const recentResults = await TestResult.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5);
      
      res.status(200).json({
        user: {
          username: user.username,
          subscription: user.subscription,
          wpm: user.wpm,
          accuracy: Math.round(user.accuracy),
          testsTaken: user.testsTaken
        },
        recentResults
      });
    } else {
      // Mock mode - simulate authentication check
      let userIdFromToken = null;
      try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer')) {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, 'mock-secret');
          userIdFromToken = decoded.userId;
        }
      } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
      
      // Check if requested userId matches token userId
      if (userIdFromToken !== userId) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
      
      // Mock mode
      res.status(200).json({
        user: {
          username: 'MockUser',
          subscription: 'free',
          wpm: 75,
          accuracy: 92,
          testsTaken: 5
        },
        recentResults: [
          { wpm: 70, accuracy: 90, timeTaken: 60, textLength: 200, createdAt: new Date() },
          { wpm: 75, accuracy: 92, timeTaken: 55, textLength: 220, createdAt: new Date() }
        ]
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update subscription
app.patch('/users/:userId/subscription', async (req, res) => {
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
    
    const { userId } = req.params;
    const { subscription } = req.body;
    
    // Validate subscription type
    const validSubscriptions = ['free', 'pro', 'trainer'];
    if (!validSubscriptions.includes(subscription)) {
      return res.status(400).json({ message: 'Invalid subscription type' });
    }
    
    if (dbConnected) {
      // Update user subscription
      const user = await User.findByIdAndUpdate(
        userId,
        { subscription },
        { new: true }
      );
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({ 
        message: 'Subscription updated successfully', 
        subscription: user.subscription
      });
    } else {
      // Mock mode
      res.status(200).json({ 
        message: 'Subscription updated successfully', 
        subscription: subscription || 'free'
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Export as Vercel serverless function
module.exports = (req, res) => {
  // Apply CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Pass the request to the Express app
  return app(req, res);
};