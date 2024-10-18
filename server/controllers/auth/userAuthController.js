/**
 * This file contains the controller functions for user authentication.
 */

import passport from 'passport';
import '../../config/passport.js';
import { createNewUser } from '../../services/userServices.js';
import { generateTokenAndCookieOptions, setTokenCookie } from '../../utils/authHelpers.js';
import { excludeSensitiveInfo } from '../../utils/excludeSensitiveInfo.js';
import { clearTokenCookie } from '../../services/authService.js';
import { UnauthorizedError, } from '../../utils/customErrors.js';


/**
 * @desc    Controller to handle the registration of new users.
 * @param   {Object} req - Express request object containing the user's data in the body.
 * @param   {Object} res - Express response object used to send the result of the registration process.
 * @param   {Function} next - Express middleware function for error handling.
 * @returns {JSON} - Success response with the created user's data and a JWT token.
 */
export const createUser = async (req, res, next) => {
  try {
    const newUser = await createNewUser(req.body);

    const { token, cookieOptions } = generateTokenAndCookieOptions(newUser);

    setTokenCookie(res, token, cookieOptions);

    const userResponse = excludeSensitiveInfo(newUser, ['password', '__v']);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: userResponse,
      token
    });
  } catch (error) {
    return next(error); 
  }
};

/**
 * Controller to handle user login via local strategy.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express middleware function for error handling.
 * @returns {JSON} - Success response with JWT token and user data.
 */
export const authenticateUser = async (req, res, next) => {
  passport.authenticate('local', { session: false }, async (err, user, info) => {
    if (err) {
      return next(err); 
    }

    if (!user) {
      const error = new UnauthorizedError(info?.message || 'Authentication failed');
      return next(error);
    }

    try {
      const { token, cookieOptions } = generateTokenAndCookieOptions(user);

      setTokenCookie(res, token, cookieOptions);

      const userResponse = excludeSensitiveInfo(user, ['password', '__v']);

      return res.status(200).json({
        success: true,
        message: 'User logged in successfully!',
        data: userResponse,
        token,
      });
    } catch (error) {
      return next(error); 
    }
  })(req, res, next);
};

/**
 * Controller for logging out a user.
 * @desc Clears the authentication token stored in the user's cookie, effectively logging them out.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object used to send the result of the logout.
 * @param {Function} next - Express middleware function for error handling.
 * @returns {JSON} - Success message indicating the user has logged out.
 */
export const logoutUser = (req, res, next) => {
  try {
    clearTokenCookie(res);

    return res.status(200).json({
      success: true,
      message: 'User logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};