/**
 * This
 */

import User from '../../models/User.js';
import { handleGoogleOAuthSignup } from '../../services/authService.js';
import {generateTokenAndCookieOptions, setTokenCookie } from '../../utils/authHelpers.js';

/**
 * Controller to handle Google OAuth Signup Callback.
 * @desc This controller is called after the Google OAuth sign-up process.
 * @param {Object} req - Express request object containing the user profile.
 * @param {Object} res - Express response object used to send the result of the signup.
 * @returns {Response} - Redirect to a success or failure page on the client.
 */
export const googleOAuthSignupCallback = async (req, res) => {
  try {
    const { user, isExisting } = req.user;  // This is passed by Passport after Google authentication

    if (!user) {
      const errorMessage = encodeURIComponent('Google OAuth failed');
      return res.redirect(`${process.env.CLIENT_URI}/signup/failure?token`);
    }

    // Generate token and get cookie options
    const { token, cookieOptions } = generateTokenAndCookieOptions(user);

    setTokenCookie(res, token, cookieOptions);

    if (isExisting) {
      const welcomeBackMessage = encodeURIComponent('Welcome back!');
      return res.redirect(`${process.env.CLIENT_URI}/signin/success?token=${token}`);
    } else {
      const successMessage = encodeURIComponent('Signup successful');
      return res.redirect(`${process.env.CLIENT_URI}/signup/success?token=${token}`);
    }
  } catch (error) {
    const errorMessage = encodeURIComponent('Error processing signup');
    return res.redirect(`${process.env.CLIENT_URI}/signup/failure?token`);
  }
};


// Google OAuth Sign-In Callback
/**
 * Google OAuth Sign-In Callback Controller
 * @desc This controller is called after the Google OAuth sign-in process.
 * @param {Object} req - Express request object containing the user profile.
 * @param {Object} res - Express response object used to send the result of the sign-in.
 * @returns {Response} - Redirect to a success or failure page on the client.
 */
export const googleOAuthSigninCallback = async (req, res) => {
  try {
    const { user } = req.user;  // This is passed by Passport after Google authentication

    if (!user) {
      const errorMessage = encodeURIComponent('Google OAuth failed');
      return res.redirect(`${process.env.CLIENT_URI}/signin/failure?token`);
    }

    // Generate JWT token and get cookie options
    const { token, cookieOptions } = generateTokenAndCookieOptions(user);

    // Set the JWT token in the cookie
    setTokenCookie(res, token, cookieOptions);

    // Redirect to frontend with success message
    const successMessage = encodeURIComponent('Signin successful');
    return res.redirect(`${process.env.CLIENT_URI}/signin/success?token=${token}`);

  } catch (error) {
    const errorMessage = encodeURIComponent('Error processing signin');
    return res.redirect(`${process.env.CLIENT_URI}/signin/failure?token`);
  }
};