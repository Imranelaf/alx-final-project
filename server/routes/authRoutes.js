import express from 'express';
import passport from 'passport'; // Passport only imported here
import '../config/passport.js';  // Load the Passport strategy configuration here

// Import your authentication controllers (if any)
import { authenticateUser, registerUser, forgotPassword, resetPassword } from '../controllers/authController.js';
import authenticateJWT from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * ============================
 * Google OAuth Routes
 * ============================
 */

// Initiate Google OAuth login
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'], // Request user's profile and email from Google
  })
);

// Google OAuth callback URL
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = req.user.token;

    // Set the token as an HTTP-only cookie (for backend security reasons)
    res.cookie('token', token, {
      httpOnly: true, // Prevent access via JavaScript
      maxAge: 3600000, // 1 hour
    });

    // Correcting the URL interpolation issue with proper backticks
    res.redirect(`http://localhost:5173?token=${token}`); // Redirect to frontend
  }
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const { token, user } = req.user;

    const frontendURL = process.env.CLIENT_URI || 'http://localhost:5173';
    
    // Redirect to frontend with token and user info
    res.redirect(`${frontendURL}/oauth-callback?token=${token}&userId=${user._id}`);
  }
);

/**
 * ============================
 * Other Authentication Routes (Non-OAuth)
 * ============================
 */

// User login with email/password
router.post('/login', authenticateUser); // Controller to handle email/password login

// Register a new user (non-OAuth)
router.post('/register', registerUser); // Controller to handle user registration

// Logout route (invalidate JWT on client side)
router.get('/logout', (req, res) => {
  // Clear the token cookie on logout
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Verify if the JWT token is still valid
router.get('/verify-token', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

export default router;