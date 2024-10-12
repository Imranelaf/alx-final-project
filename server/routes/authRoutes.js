import express from 'express';
import passport from 'passport';
import '../config/passport.js'; // Ensure Passport configuration is loaded
import { authenticateUser, registerUser, forgotPassword, resetPassword } from '../controllers/localAuthController.js';
import { googleOAuthSignupCallback, googleOAuthSigninCallback } from '../controllers/googleOAuthController.js';
import authenticateJWT from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * ============================
 * Google OAuth Routes
 * ============================
 */

// Google OAuth Sign-Up Route
router.get('/google/signup', passport.authenticate('google-signup'));

// Google OAuth Sign-In Route
router.get('/google/signin', passport.authenticate('google-signin'));

// Handle Google OAuth callback for Sign Up
// Handle Google OAuth callback for Sign Up
router.get(
  '/google/signup/callback',
  passport.authenticate('google-signup', { session: false, failureRedirect: `${process.env.CLIENT_URI}/signup` }),
  googleOAuthSignupCallback
);

// Handle Google OAuth callback for Sign In
router.get(
  '/google/signin/callback',
  passport.authenticate('google-signin', { session: false, failureRedirect: `${process.env.CLIENT_URI}/signin` }),
  googleOAuthSigninCallback
);


/**
 * ============================
 * Other Authentication Routes (Non-OAuth)
 * ============================
 */

// User login with email/password
router.post('/login', authenticateUser);

// Register a new user (non-OAuth)
router.post('/register', registerUser);

// Logout route (invalidate JWT on client side)
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Verify if the JWT token is still valid
router.get('/verify-token', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

export default router;
