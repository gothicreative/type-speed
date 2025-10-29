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

// Register a new user
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
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

module.exports = app;