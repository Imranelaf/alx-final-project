import User from '../models/User.js';
import generateUniqueUsername from '../utils/generateUniqueUsername.js';
import { generateJWT, setTokenCookie } from '../utils/oauthHelpers.js';

// Google OAuth Sign-Up Callback
export const googleOAuthSignupCallback = async (req, res) => {
  try {
    const userProfile = req.user;

    if (!userProfile) {
      // Encode the message before redirecting
      const errorMessage = encodeURIComponent('Google OAuth failed');
      return res.redirect(`${process.env.CLIENT_URI}/signup/failure?message=${errorMessage}`);
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ googleId: userProfile.googleId });
    if (existingUser) {
      // Encode the message before redirecting
      const errorMessage = encodeURIComponent('User already exists, please sign in');
      return res.redirect(`${process.env.CLIENT_URI}/signin?message=${errorMessage}`);
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
    const successMessage = encodeURIComponent('Signup successful');
    return res.redirect(`${process.env.CLIENT_URI}/signup/success?message=${successMessage}`);
  } catch (error) {
    console.error('Error during Google OAuth sign-up callback:', error);
    // Encode the message before redirecting
    const errorMessage = encodeURIComponent('Error processing signup');
    return res.redirect(`${process.env.CLIENT_URI}/signup/failure?message=${errorMessage}`);
  }
};

// Google OAuth Sign-In Callback
export const googleOAuthSigninCallback = async (req, res) => {
  try {
    const userProfile = req.user;

    if (!userProfile) {
      // Encode the message before redirecting
      const errorMessage = encodeURIComponent('Google OAuth failed');
      return res.redirect(`${process.env.CLIENT_URI}/signin/failure?message=${errorMessage}`);
    }

    // Check if the user exists in the database
    const existingUser = await User.findOne({ googleId: userProfile.googleId });
    if (!existingUser) {
      // Encode the message before redirecting
      const errorMessage = encodeURIComponent('User not found, please sign up');
      return res.redirect(`${process.env.CLIENT_URI}/signup/failure?message=${errorMessage}`);
    }

    // Generate JWT token for the existing user and set it as a cookie
    const token = generateJWT(existingUser);
    setTokenCookie(res, token);

    // Redirect to frontend with success message
    const successMessage = encodeURIComponent('Signin successful');
    return res.redirect(`${process.env.CLIENT_URI}/signin/success?message=${successMessage}`);
  } catch (error) {
    console.error('Error during Google OAuth sign-in callback:', error);
    // Encode the message before redirecting
    const errorMessage = encodeURIComponent('Error processing signin');
    return res.redirect(`${process.env.CLIENT_URI}/signin/failure?message=${errorMessage}`);
  }
};
