import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';
import Admin from '../models/Admin.js';  // Import Admin model
import { formatError } from '../utils/errorFormatter.js'; // For consistent error formatting

// Define the local strategy for email/password authentication
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
            [{ field: 'email', message: 'User not found' }],
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

// Define the local strategy for admin email/password authentication
passport.use(
  'admin-local',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        // Find admin by email
        const admin = await Admin.findOne({ email });

        if (!admin) {
          // Admin not found, propagate error using done()
          const error = formatError(
            'Invalid email or password.',
            [{ field: 'email', message: 'Admin not found' }],
            401
          );
          return done(null, false, error);  // Passed as info to the next middleware
        }

        // Check if the password is valid
        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
          const error = formatError(
            'Invalid email or password.',
            [{ field: 'password', message: 'Incorrect password' }],
            401
          );
          return done(null, false, error);  // Passed as info to the next middleware
        }

        // Authentication successful, return admin
        return done(null, admin);
      } catch (error) {
        // Catch and propagate server errors
        const serverError = formatError('Server error during authentication', [], 500);
        return done(serverError);  // Passed as error to the next middleware
      }
    }
  )
);

// Sign-up strategy
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

// Sign-in strategy
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
