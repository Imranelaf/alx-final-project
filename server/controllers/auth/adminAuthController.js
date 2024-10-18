/**
 * Thie file contains the controller functions for handling admin authentication operations.
 */

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
      const newAdmin = await createNewAdmin(req.body);
  
      const { token, cookieOptions } = generateTokenAndCookieOptions(newAdmin);
  
      setTokenCookie(res, token, cookieOptions);
  
      const adminResponse = excludeSensitiveInfo(newAdmin, ['password', '__v']);
  
      return res.status(201).json({
        success: true,
        message: 'Admin created successfully.',
        data: adminResponse,
        token
      });
    } catch (error) {
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
      return next(err);
    }

    if (!admin) {
      const error = new UnauthorizedError(info?.message || 'Authentication failed');
      return next(error);
    }

    try {
      const { token, cookieOptions } = generateTokenAndCookieOptions(admin);

      setTokenCookie(res, token, cookieOptions);

      const adminResponse = excludeSensitiveInfo(admin, ['password', '__v']);

      return res.status(200).json({
        success: true,
        message: 'Admin logged in successfully!',
        data: adminResponse,
        token
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};