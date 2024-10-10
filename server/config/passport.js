import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 
import generateUniqueUsername from '../utils/generateUniqueUsername.js'; 


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      const {
        id,                             // Google user ID
        name: { givenName: firstName = '', familyName: lastName = '' },
        emails: [{ value: email = '' } = {}],
        photos: [{ value: avatar = '' } = {}],
      } = profile;

      try {
        let user = await User.findOne({ googleId: id });

        if (!user) {
          const username = await generateUniqueUsername(firstName, lastName, email);

          user = new User({
            firstName,
            lastName,
            email,
            avatar,
            googleId: id,
            username,
            isUsernameCustomized: false, // Flag to indicate if the username is auto-generated
          });
          await user.save();
        }
        
        const token = jwt.sign(
          { id: user._id, username: user.username, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;