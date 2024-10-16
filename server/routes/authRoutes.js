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
  createUser,
  authenticateUser,
  logoutUser,
  // forgotPassword,
  // resetPassword,
  // verifyToken
} from '../controllers/auth/userAuthController.js';
import { validateUserFields } from '../middleware/validation/userValidation.js';

import authenticateJWT from '../middleware/auth/authMiddleware.js';

import {
  createAdmin,
  loginAdmin,
} from '../controllers/auth/adminAuthController.js';
import { validateAdminFields } from '../middleware/validation/adminValidation.js';
import {checkIsSuperAdmin} from '../middleware/auth/roleMiddleware.js';

import {
  createAgent,
  loginAgent,
} from '../controllers/auth/agentAuthController.js';
import { handleValidationErrors } from '../middleware/common/handleValidationErrors.js';
import { validateAgentFields } from '../middleware/validation/agentValidation.js';  // Input validation for agents



const router = express.Router();

/**
 * ============================
 * Google OAuth Routes
 * ============================
 */

// Google OAuth Sign-Up Route
router.get(
  '/google/signup', 
  passport.authenticate('google-signup'));

// Google OAuth Sign-In Route
router.get(
  '/google/signin', 
  passport.authenticate('google-signin')
);

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
router.post(
  '/signup', 
  validateUserFields,
  handleValidationErrors,  
  createUser
);

// Check if username is available (with validation middleware)
router.get(
  '/check-username/:username', 
  checkUsername);

// Check if email is already registered (with validation middleware)
router.get(
  '/check-email/:email', 
  checkEmail);


// User login with email and password (Local Authentication)
router.post(
  '/signin', 
  authenticateUser
);

// Logout route (JWT-based, invalidates JWT on the client-side)
router.post(
  '/logout', 
  logoutUser
);

/* 
// Forgot Password (Send reset password link)
router.post('/forgot-password', forgotPassword);

// Reset Password (Handle reset with token)
router.post('/reset-password', resetPassword);

// Verify if the JWT token is still valid
router.get('/verify-token', authenticateJWT, verifyToken);
*/

/**
 * ============================
 * Admin Authentication Routes
 * ============================
 */

// Create a new admin (super admin only)
router.post(
  '/admins/signup',
  authenticateJWT, 
  checkIsSuperAdmin,
  validateAdminFields,
  handleValidationErrors,  
  createAdmin
);

// Admin Login
router.post(
  '/admins/login',
   loginAdmin
);

/**
 * ============================
 * Agent Authentication Routes
 * ============================
 */

// Register a new agent (public route)
router.post(
  '/agents/signup',
  validateAgentFields,
  handleValidationErrors,  
  createAgent
);

// Agent login route (public)
router.post(
  '/agents/login',
  loginAgent
);

export default router;
