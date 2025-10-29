const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
let dbConnected = false;
const connectDB = async () => {
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
};

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
connectDB();

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

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

// Routes

// Register a new user
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (dbConnected) {
      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email or username' });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        subscription: 'free',
        wpm: 0,
        accuracy: 0,
        testsTaken: 0
      });
      
      const savedUser = await newUser.save();
      
      // Generate token
      const token = generateToken(savedUser._id);
      
      res.status(201).json({ 
        message: 'User created successfully', 
        userId: savedUser._id,
        username: savedUser.username,
        subscription: savedUser.subscription,
        token
      });
    } else {
      // Mock mode - always successful
      res.status(201).json({ 
        message: 'User created successfully', 
        userId: 'mock-user-id',
        username: username,
        subscription: 'free'
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login user
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (dbConnected) {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      // Generate token
      const token = generateToken(user._id);
      
      res.status(200).json({ 
        message: 'Login successful', 
        userId: user._id, 
        username: user.username,
        subscription: user.subscription,
        token
      });
    } else {
      // Mock mode - always successful
      res.status(200).json({ 
        message: 'Login successful', 
        userId: 'mock-user-id', 
        username: 'MockUser',
        subscription: 'free'
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Save typing test result
app.post('/results', protect, async (req, res) => {
  try {
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

// Get user stats
app.get('/users/:userId/stats', protect, async (req, res) => {
  try {
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
app.patch('/users/:userId/subscription', protect, async (req, res) => {
  try {
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

// Get leaderboard - top users by WPM
app.get('/leaderboard', async (req, res) => {
  try {
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

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'SpeedType Trainer API - Vercel Serverless Function' });
});

// Vercel serverless function export
module.exports = app;