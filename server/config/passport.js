/**
 * This file configures the passport authentication middleware using JWT strategy 
 * to verify tokens and authenticate admin users. It attaches the admin data 
 * to the request object upon successful authentication.
 */

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { 
  authenticateAdmin, 
  authenticateAgent,
  authenticateUserService
}  from '../services/authService.js';  // If singular, for example
import { 
  handleGoogleOAuthSignup, 
  handleGoogleOAuthSignin,
} from '../services/authService.js'; // Import service function


passport.use(
  'local',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await authenticateUserService(email, password);
        return done(null, user);
      } catch (error) {
        return done(error, false);
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

passport.use(
  'google-signup',
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
        // Pass profile data to the service layer for sign-up logic
        const { user, isExisting } = await handleGoogleOAuthSignup({ googleId, firstName, lastName, email, avatar });
        return done(null, { user, isExisting }); // Pass both user and isExisting flag
      } catch (error) {
        return done(error, null); // In case of an error, pass it to Passport
      }
    }
  )
);

passport.use(
  'google-signin',
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
        // Pass profile data to the service layer for sign-in logic
        const user = await handleGoogleOAuthSignin({ googleId, firstName, lastName, email, avatar });
        return done(null, { user }); // Pass user object to Passport
      } catch (error) {
        return done(error, null); // Handle errors
      }
    }
  )
);

export default passport;
