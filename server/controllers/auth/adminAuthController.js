


import {generateTokenAndCookieOptions, setTokenCookie } from '../../utils/authHelpers.js';
import passport from 'passport';
import '../../config/passport.js';
import {excludeSensitiveInfo} from '../../utils/excludeSensitiveInfo.js';
import { 
  createNewAdmin, 
 } from '../../services/adminService.js';
import { UnauthorizedError, } from '../../utils/customErrors.js';


/**
 * Controller to create a new admin.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express middleware function for error handling.
 * @returns {JSON} - Returns the created admin and a JWT token.
 */
export const createAdmin = async (req, res, next) => {
    try {
      // Call the service layer to create a new admin
      const newAdmin = await createNewAdmin(req.body);
  
      // Generate token and get cookie options
      const { token, cookieOptions } = generateTokenAndCookieOptions(newAdmin);
  
      // Set the JWT token in the cookie
      setTokenCookie(res, token, cookieOptions);
  
      // Exclude sensitive fields (like password) from the response
      const adminResponse = excludeSensitiveInfo(newAdmin, ['password', '__v']);
  
      // Send success response
      return res.status(201).json({
        success: true,
        message: 'Admin created successfully.',
        data: adminResponse,
      });
    } catch (error) {
      // Pass the error to the global error handler
      return next(error);
    }
  };
  
/**
 * Login admin controller.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express middleware function for error handling.
 */
export const loginAdmin = (req, res, next) => {
  passport.authenticate('admin-local', { session: false }, async (err, admin, info) => {
    if (err) {
      return next(err);  // Handle server error
    }

    if (!admin) {
      // If no admin is found, pass the UnauthorizedError to the error handler
      const error = new UnauthorizedError(info?.message || 'Authentication failed');
      return next(error);
    }

    try {
      // Generate token and get cookie options
      const { token, cookieOptions } = generateTokenAndCookieOptions(admin);

      // Set the JWT token in the cookie
      setTokenCookie(res, token, cookieOptions);

      // Exclude sensitive fields from the response
      const adminResponse = excludeSensitiveInfo(admin, ['password', '__v']);

      return res.status(200).json({
        success: true,
        message: 'Admin logged in successfully!',
        data: adminResponse,
      });
    } catch (error) {
      // Pass any errors to the error handler
      return next(error);
    }
  })(req, res, next);
};