/**
 * Controller functions for managing admin operations such as creating, updating, deleting admins, and
 * handling admin authentication. Includes JWT generation and error handling.
 */

import Admin from '../../models/Admin.js';
import { validationResult } from 'express-validator';
import { generateJWT, generateTokenAndCookieOptions, setTokenCookie } from '../../utils/authHelpers.js';
import passport from 'passport';
import '../../config/passport.js';
import { formatError } from '../../utils/errorFormatter.js';
import {isValidObjectId} from '../../utils/mongooseUtils.js';
import {excludeSensitiveInfo} from '../../utils/excludeSensitiveInfo.js';
import { 
  createNewAdmin, 
  getAllAdminsService, 
  getAdminByIdService,
  deleteAdminService,
  updateAdminService,
 } from '../../services/adminService.js';
import { UnauthorizedError, } from '../../utils/customErrors.js';  // Adjust path if needed


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


/**
 * @desc    Controller to handle the retrieval of all admin users.
 * @route   GET /api/admin
 * @access  Private (Admin)
 * @param   {Object} req - Express request object containing the user's authentication details.
 * @param   {Object} res - Express response object for sending the list of admins.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - JSON response with the success status and list of all admin users.
 */
export const getAllAdmins = async (req, res, next) => {
  try {
    // Get the raw admin data from the service layer
    const admins = await getAllAdminsService();
    
    // Sanitize the data by excluding sensitive fields like passwords
    const sanitizedAdmins = admins.map(admin => excludeSensitiveInfo(admin, ['password', '__v']));

    // Respond with the sanitized admin data
    return res.status(200).json({
      success: true,
      data: sanitizedAdmins,
    });

  } catch (error) {
    return next(error); // Pass errors to the global error handler
  }
};

export const getAdminById = async (req, res, next) => {
  try {
    // Extract the admin ID from the request parameters
    const { id } = req.params;

    // Call the service layer to get the admin by ID
    const admin = await getAdminByIdService(id);

    const sanitizedAdmin = excludeSensitiveInfo(admin, ['password', '__v']);

    // Respond with the admin data (excluding sensitive info like password)
    return res.status(200).json({
      success: true,
      data: sanitizedAdmin,
    });

  } catch (error) {
    // Pass the error to the global error handler
    return next(error);
  }
};

/**
 * @desc    Controller to delete an admin by ID.
 * @route   DELETE /api/admin/:id
 * @access  Private (Admin)
 * @param   {Object} req - Express request object containing the admin ID in the params.
 * @param   {Object} res - Express response object used to send the deletion result.
 * @param   {Function} next - Express middleware function for error handling.
 * @returns {JSON} - Success message or error response.
 */
export const deleteAdmin = async (req, res, next) => {
  try {
    // Extract admin ID from request parameters
    const { id } = req.params;

    // Call the service to handle admin deletion
    await deleteAdminService(id);

    // Send success response after admin is deleted
    return res.status(200).json({
      success: true,
      message: 'Admin deleted successfully!',
    });
  } catch (error) {
    // Pass the error to the global error handler
    return next(error);
  }
};

/**
 * @desc    Controller to update a specific admin's information.
 * @route   PUT /api/admin/:id
 * @access  Private (Admin or Super Admin)
 * @param   {Object} req - Express request object containing the admin ID in params and updated data in the body.
 * @param   {Object} res - Express response object for sending the updated admin data.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - Success response with updated admin data or error.
 */
export const updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    console.log(req.user);
    const userRole = req.user.role;  // Get the user's role from the request (e.g., 'admin' or 'super-admin')

    // Call the service to update the admin and pass the userRole
    const updatedAdmin = await updateAdminService(id, updates, userRole);
    
    const sanitizedUpdatedAdmin = excludeSensitiveInfo(updatedAdmin, ['password', '__v']);


    return res.status(200).json({
      success: true,
      message: 'Admin information updated successfully.',
      data: sanitizedUpdatedAdmin,
    });
  } catch (error) {
    return next(error);  // Pass the error to the global error handler
  }
};
