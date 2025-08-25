const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    
    // Validate input
    if (!username || !email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if user exists
    const userExists = await db.queryGet(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    
    if (userExists) {
      return res.status(400).json({ 
        error: 'User already exists with this email or username' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const result = await db.queryRun(
      'INSERT INTO users (username, email, password, name) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, name]
    );
    
    // Generate token
    const token = jwt.sign({ userId: result.lastID }, JWT_SECRET);
    
    // Get the newly created user
    const newUser = await db.queryGet(
      'SELECT id, username, email, name FROM users WHERE id = ?',
      [result.lastID]
    );
    
    res.status(201).json({ 
      message: 'Registration successful',
      token, 
      user: newUser 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const user = await db.queryGet(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Debug: Check if password exists
    console.log('User password from DB:', user.password);
    
    // Check password - ensure user.password is not undefined
    if (!user.password) {
      return res.status(500).json({ error: 'Database error: Password not found' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    
    res.json({ 
      message: 'Login successful',
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;