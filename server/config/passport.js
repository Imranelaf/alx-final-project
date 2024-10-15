/**
 * This file configures the passport authentication middleware using JWT strategy 
 * to verify tokens and authenticate admin users. It attaches the admin data 
 * to the request object upon successful authentication.
 */

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';
import Agent from '../models/Agent.js';
import { formatError } from '../utils/errorFormatter.js';
import { authenticateAdmin, authenticateAgent } from '../services/authService.js';  // If singular, for example


/*
 * Passport local strategy for authenticating users with an email and password.
 * This strategy handles the verification of user credentials during login.
 * 
 * @param {String} email - The email provided by the user.
 * @param {String} password - The password provided by the user.
 * @param {Function} done - Callback function to indicate success or failure.
 * @returns {Object} - Calls `done` with `null` and user data if successful or an error/info object otherwise.
 */
passport.use(
  'local',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
          // User not found, propagate error using done()
          const error = formatError(
            'Invalid email or password.',
            [{ field: 'email', message: 'Admin not found' }],
            401
          );
          return done(null, false, error); // Passed as info to the next middleware
        }

        // Check if the password is valid
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          const error = formatError(
            'Invalid email or password.',
            [{ field: 'password', message: 'Incorrect password' }],
            401
          );
          return done(null, false, error); // Passed as info to the next middleware
        }

        // Authentication successful
        return done(null, user);
      } catch (error) {
        // Catch and propagate server errors
        const serverError = formatError('Server error during authentication', [], 500);
        return done(serverError);  // Passed as error to the next middleware
      }
    }
  )
);


passport.use(
  'admin-local',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const admin = await authenticateAdmin(email, password);
        return done(null, admin);  // Pass the authenticated admin to the next middleware
      } catch (error) {
        return done(null, false, { message: error.message });  // Pass the error to the controller
      }
    }
  )
);

// Passport strategy for agent-local authentication
// Passport strategy for agent-local authentication
passport.use(
  'agent-local',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        // Call the service to handle agent authentication
        const { agent } = await authenticateAgent(email, password);

        // Pass the authenticated agent to the next middleware
        return done(null, agent);
      } catch (error) {
        // Pass the error to the controller (since service now throws errors)
        return done(null, false, error);
      }
    }
  )
);


/*
 * Passport strategy for signing up users using Google OAuth 2.0.
 * This strategy handles the Google sign-up flow, extracting user profile details like name, email, and avatar.
 * 
 * @param {String} accessToken - OAuth access token from Google.
 * @param {String} refreshToken - OAuth refresh token from Google.
 * @param {Object} profile - Google user profile object containing user data like email, name, and avatar.
 * @param {Function} done - Callback function to indicate success or failure.
 * @returns {Object} - Calls `done` with user profile data if successful or an error if something goes wrong.
 */
passport.use('google-signup',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_SIGNUP_REDIRECT_URI,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id: googleId, name: { givenName: firstName = '', familyName: lastName = '' }, emails: [{ value: email = '' } = {}], photos: [{ value: avatar = '' } = {}] } = profile;

      try {
        // Logic for signup goes here
        return done(null, { googleId, firstName, lastName, email, avatar });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

/*
 * Passport strategy for signing in users using Google OAuth 2.0.
 * This strategy handles the Google sign-in flow, extracting user profile details like name, email, and avatar.
 * 
 * @param {String} accessToken - OAuth access token from Google.
 * @param {String} refreshToken - OAuth refresh token from Google.
 * @param {Object} profile - Google user profile object containing user data like email, name, and avatar.
 * @param {Function} done - Callback function to indicate success or failure.
 * @returns {Object} - Calls `done` with user profile data if successful or an error if something goes wrong.
 */
passport.use('google-signin',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_SIGNIN_REDIRECT_URI,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id: googleId, name: { givenName: firstName = '', familyName: lastName = '' }, emails: [{ value: email = '' } = {}], photos: [{ value: avatar = '' } = {}] } = profile;

      try {
        // Logic for signin goes here
        return done(null, { googleId, firstName, lastName, email, avatar });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
