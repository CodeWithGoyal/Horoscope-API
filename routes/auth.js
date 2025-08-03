const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { signupSchema, loginSchema } = require('../validation/schemas');

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
      const body = req.body || {};
      
      const { error, value } = signupSchema.validate(body);
      
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
  
      const { name, email, password, birthdate } = value;
  
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ error: 'Database not available' });
      }
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }
    
      const birthDate = new Date(birthdate);
      
      const user = new User({
        name,
        email,
        password,
        birthdate: birthDate
      });
  
      await user.save();
  
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );
  
      res.status(201).json({
        message: 'User created successfully',
        user,
        token
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

router.post('/login', async (req, res) => {
    try {
        const body = req.body || {};
        
        const { error, value } = loginSchema.validate(body);
        if (error) {
        return res.status(400).json({ error: error.details[0].message });
        }

        const { email, password } = value;

        if (mongoose.connection.readyState !== 1) {
          return res.status(503).json({ error: 'Database not available' });
        }

        const user = await User.findOne({ email });
        if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            user,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
  
module.exports = router;