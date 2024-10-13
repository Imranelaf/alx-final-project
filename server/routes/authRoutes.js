import express from 'express';
import passport from 'passport';
import '../config/passport.js'; // Ensure Passport configuration is loaded
import {
  googleOAuthSignupCallback,
  googleOAuthSigninCallback
} from '../controllers/auth/googleOAuthController.js';
import {
  checkUsername,
  checkEmail,
} from '../controllers/validation/validationController.js'; // Controllers for username and email checks
import {
  signupUser,
  authenticateUser,
  // logoutUser,
  // forgotPassword,
  // resetPassword,
  // verifyToken
} from '../controllers/auth/localAuthController.js';
import { validateSignUpFields } from '../middleware/validation/signupValidation.js';
import { validateUsernameParam, validateEmailParam } from '../middleware/validation/checkUsernameEmailValidation.js';
import { handleValidationErrors } from '../middleware/validation/handleValidationErrors.js';
import authenticateJWT from '../middleware/auth/authMiddleware.js';

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

// Google OAuth Callback for Sign Up
router.get(
  '/google/signup/callback',
  passport.authenticate('google-signup', { session: false, failureRedirect: `${process.env.CLIENT_URI}/signup` }),
  googleOAuthSignupCallback
);

// Google OAuth Callback for Sign In
router.get(
  '/google/signin/callback',
  passport.authenticate('google-signin', { session: false, failureRedirect: `${process.env.CLIENT_URI}/signin` }),
  googleOAuthSigninCallback
);

/**
 * ============================
 * Local Authentication Routes
 * ============================
 */

// Sign-up route with validation
router.post('/signup', validateSignUpFields, handleValidationErrors, signupUser);

// Check if username is available (with validation middleware)
router.get('/check-username/:username', validateUsernameParam, handleValidationErrors, checkUsername);

// Check if email is already registered (with validation middleware)
router.get('/check-email/:email', validateEmailParam, handleValidationErrors, checkEmail);

// User login with email and password (Local Authentication)
router.post('/signin', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);  // Pass server-side error to global error handler
    }

    if (!user) {
      // Pass the formatted error (`info`) to the global error handler
      return next(info);
    }

    // If authentication is successful, proceed to the controller
    req.user = user;
    next();
  })(req, res, next);
}, authenticateUser);

/* 
// Logout route (JWT-based, invalidates JWT on the client-side)
router.post('/logout', logoutUser);

// Forgot Password (Send reset password link)
router.post('/forgot-password', forgotPassword);

// Reset Password (Handle reset with token)
router.post('/reset-password', resetPassword);

// Verify if the JWT token is still valid
router.get('/verify-token', authenticateJWT, verifyToken);
*/

export default router;
