import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

// Sign-up strategy
passport.use('google-signup',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_SIGNUP_REDIRECT_URI,  // <-- Sign-up redirect URI
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
      callbackURL: process.env.GOOGLE_OAUTH_SIGNIN_REDIRECT_URI,  // <-- Sign-in redirect URI
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
