import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin@aadishakti';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '8h';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check username
    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({ error: 'Invalid credentials. Please try again.' });
    }

    // Check password - compare plain text directly for now
    // In production with database, you would compare hashed passwords
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid credentials. Please try again.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Set httpOnly cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });

    res.json({
      success: true,
      token,
      username,
      expiresIn: JWT_EXPIRY
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// POST /api/auth/logout
router.post('/logout', requireAdmin, (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/verify
router.get('/verify', requireAdmin, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

export default router;
