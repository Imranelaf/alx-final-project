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
    // Call the service layer to create a new user
    const newUser = await createNewUser(req.body);

    // Generate token and get cookie options
    const { token, cookieOptions } = generateTokenAndCookieOptions(newUser);

    // Set the JWT token in the cookie
    setTokenCookie(res, token, cookieOptions);

    // Exclude sensitive fields (like password) from the response
    const userResponse = excludeSensitiveInfo(newUser, ['password', '__v']);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: userResponse,
      token
    });
  } catch (error) {
    return next(error); // Pass errors to the global error handler
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
      return next(err);  // Pass server-side error to global error handler
    }

    if (!user) {
      // Handle authentication failure
      const error = new UnauthorizedError(info?.message || 'Authentication failed');
      return next(error);
    }

    try {
      // Generate JWT token and cookie options
      const { token, cookieOptions } = generateTokenAndCookieOptions(user);

      // Set the JWT token in the cookie
      setTokenCookie(res, token, cookieOptions);

      // Exclude sensitive fields like password from the response
      const userResponse = excludeSensitiveInfo(user, ['password', '__v']);

      // Send success response
      return res.status(200).json({
        success: true,
        message: 'User logged in successfully!',
        data: userResponse,
        token,
      });
    } catch (error) {
      return next(error);  // Pass any unexpected error to the global error handler
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
    // Call the service to clear the authentication token cookie
    clearTokenCookie(res);

    // Send a response indicating successful logout
    return res.status(200).json({
      success: true,
      message: 'User logged out successfully.',
    });
  } catch (error) {
    next(error); // Pass any errors to the global error handler
  }
};

