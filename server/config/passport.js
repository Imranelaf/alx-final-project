/**
 * Passport configuration file
 */

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { 
  authenticateUserService
}  from '../services/authService.js';
import { 
  handleGoogleOAuthSignup, 
  handleGoogleOAuthSignin,
} from '../services/authService.js';


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
        const user = await handleGoogleOAuthSignin({ googleId, firstName, lastName, email, avatar });
        return done(null, { user }); 
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
