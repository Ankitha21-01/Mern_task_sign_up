require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;
const DEMO_MODE = process.env.DEMO_MODE === 'true';
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB user model (used in MongoDB mode)
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // stored as a bcrypt hash, never plain text
  },
  { timestamps: true }
);
const User = mongoose.model('User', userSchema);

// In-memory storage for DEMO_MODE (lost when the server stops)
const demoUsers = new Map();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.get('/', (req, res) => {
  res.send('MERN Task 2 Sign Up API is running');
});

app.post('/api/signup', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Demo mode: no database, data is not saved permanently
    if (DEMO_MODE) {
      if (demoUsers.has(email)) {
        return res.status(409).json({ message: 'This email is already registered.' });
      }
      const hash = await bcrypt.hash(password, 10);
      demoUsers.set(email, { email, password: hash });
      return res.status(201).json({ message: 'Sign Up Successful', mode: 'demo', user: { email } });
    }

    // MongoDB mode: check for duplicate, hash password, save
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'This email is already registered.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });

    return res.status(201).json({
      message: 'Sign Up Successful',
      mode: 'mongodb',
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This email is already registered.' });
    }
    console.error('Sign up error:', err);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

async function start() {
  if (DEMO_MODE) {
    console.log('DEMO MODE: users are NOT saved permanently.');
  } else {
    if (!MONGODB_URI) {
      console.error('MONGODB_URI is missing. Add it to backend/.env (or set DEMO_MODE=true).');
      process.exit(1);
    }
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB Atlas');
    } catch (err) {
      console.error('MongoDB connection failed:', err.message);
      process.exit(1);
    }
  }

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

start();
