import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Import the User model

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, emails, photos } = profile;

      try {
        // Check if the user already exists in the database
        let user = await User.findOne({ googleId: id });

        if (!user) {
          // Create a new user if they don't exist
          user = new User({
            username: displayName,
            email: emails[0].value,
            avatar: photos[0].value,
            googleId: id,
          });
          await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user._id, username: user.username, email: user.email },
          process.env.JWT_SECRET, // Secure secret key from .env
          { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Pass the token to the next middleware
        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;