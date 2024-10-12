import User from '../models/User.js';
import generateUniqueUsername from '../utils/generateUniqueUsername.js';
import { generateJWT, setTokenCookie } from '../utils/oauthHelpers.js';

// Google OAuth Sign-Up Callback
export const googleOAuthSignupCallback = async (req, res) => {
  try {
    const userProfile = req.user;

    if (!userProfile) {
      // Redirect to frontend with error message
      return res.redirect(`${process.env.CLIENT_URI}/signup/failure?message=Google%20OAuth%20failed`);
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ googleId: userProfile.googleId });
    if (existingUser) {
      // Redirect to frontend with error message
      return res.redirect(`${process.env.CLIENT_URI}/signup/failure?message=User%20already%20exists`);
    }

    // Create a new user in the database
    const newUser = new User({
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
      googleId: userProfile.googleId,
      avatar: userProfile.avatar,
      username: await generateUniqueUsername(userProfile.firstName, userProfile.lastName, userProfile.email),
    });

    await newUser.save();

    // Generate JWT token and set it as a cookie
    const token = generateJWT(newUser);
    setTokenCookie(res, token);

    // Redirect to frontend with success message
    return res.redirect(`${process.env.CLIENT_URI}/signup/success`);
  } catch (error) {
    console.error('Error during Google OAuth sign-up callback:', error);
    // Redirect to frontend with error message
    return res.redirect(`${process.env.CLIENT_URI}/signup/failure?message=Error%20processing%20signup`);
  }
};

// Google OAuth Sign-In Callback
export const googleOAuthSigninCallback = async (req, res) => {
  try {
    const userProfile = req.user;

    if (!userProfile) {
      // Redirect to frontend with error message
      return res.redirect(`${process.env.CLIENT_URI}/signin/failure?message=Google%20OAuth%20failed`);
    }

    // Check if the user exists in the database
    const existingUser = await User.findOne({ googleId: userProfile.googleId });
    if (!existingUser) {
      // Redirect to frontend with error message
      return res.redirect(`${process.env.CLIENT_URI}/signin/failure?message=User%20not%20found`);
    }

    // Generate JWT token for the existing user and set it as a cookie
    const token = generateJWT(existingUser);
    setTokenCookie(res, token);

    // Redirect to frontend with success message
    return res.redirect(`${process.env.CLIENT_URI}/signin/success`);
  } catch (error) {
    console.error('Error during Google OAuth sign-in callback:', error);
    // Redirect to frontend with error message
    return res.redirect(`${process.env.CLIENT_URI}/signin/failure?message=Error%20processing%20signin`);
  }
};
