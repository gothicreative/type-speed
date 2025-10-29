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

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Login user
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
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

module.exports = app;