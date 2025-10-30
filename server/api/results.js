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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
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

// Save typing test result
app.post('/results', async (req, res) => {
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
    
    const { userId, wpm, accuracy, timeTaken, textLength } = req.body;
    
    if (dbConnected) {
      // Save test result
      const newResult = new TestResult({
        userId,
        wpm,
        accuracy,
        timeTaken,
        textLength
      });
      
      const savedResult = await newResult.save();
      
      // Update user stats
      const user = await User.findById(userId);
      if (user) {
        // Update best WPM if current is higher
        if (wpm > user.wpm) {
          user.wpm = wpm;
        }
        
        // Update average accuracy
        const totalTests = user.testsTaken;
        const newAvgAccuracy = ((user.accuracy * totalTests) + accuracy) / (totalTests + 1);
        user.accuracy = newAvgAccuracy;
        
        // Increment tests taken
        user.testsTaken = totalTests + 1;
        
        await user.save();
      }
      
      res.status(201).json({ message: 'Result saved successfully', resultId: savedResult._id });
    } else {
      // Mock mode
      res.status(201).json({ message: 'Result saved successfully', resultId: 'mock-result-id' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Export as Vercel serverless function
module.exports = (req, res) => {
  // Apply CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Pass the request to the Express app
  return app(req, res);
};