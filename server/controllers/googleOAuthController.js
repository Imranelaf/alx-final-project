// controllers/googleOAuthController.js
import User from '../models/User.js';
import generateUniqueUsername from '../utils/generateUniqueUsername.js';
import { generateJWT, setTokenCookie, sendUserResponse } from '../utils/oauthHelpers.js';

// Google OAuth Sign-Up Callback
export const googleOAuthSignupCallback = async (req, res) => {
  try {
    const userProfile = req.user;

    if (!userProfile) {
      return res.status(500).json({ message: 'Google OAuth failed. No user info received.' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ googleId: userProfile.googleId });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists. Please sign in.' });
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

    // Send user response
    sendUserResponse(res, newUser, 'Signup successful', 201);
  } catch (error) {
    console.error('Error during Google OAuth sign-up callback:', error);
    res.status(500).json({ message: 'Error processing Google OAuth sign-up' });
  }
};

// Google OAuth Sign-In Callback
export const googleOAuthSigninCallback = async (req, res) => {
  try {
    const userProfile = req.user;

    if (!userProfile) {
      return res.status(500).json({ message: 'Google OAuth failed. No user info received.' });
    }

    // Check if the user exists in the database
    const existingUser = await User.findOne({ googleId: userProfile.googleId });
    if (!existingUser) {
      return res.status(401).json({ message: 'User not found. Please sign up first.' });
    }

    // Generate JWT token for the existing user and set it as a cookie
    const token = generateJWT(existingUser);
    setTokenCookie(res, token);

    // Send user response
    sendUserResponse(res, existingUser, 'Signin successful');
  } catch (error) {
    console.error('Error during Google OAuth sign-in callback:', error);
    res.status(500).json({ message: 'Error processing Google OAuth sign-in' });
  }
};
