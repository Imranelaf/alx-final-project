/**
 * Controller functions for managing admin operations such as creating, updating, deleting admins, and
 * handling admin authentication. Includes JWT generation and error handling.
 */

import Admin from '../../models/Admin.js';
import { validationResult } from 'express-validator';
import { generateJWT, setTokenCookie } from '../../utils/authHelpers.js';
import passport from 'passport';
import '../../config/passport.js';
import { formatError } from '../../utils/errorFormatter.js';
import {isValidObjectId} from '../../utils/mongooseUtils.js';

/**
 * @desc Create a new admin (super-admin only)
 * @param {Object} req - Express request object containing admin's data.
 * @param {Object} res - Express response object used to send the result.
 * @param {Function} next - Express middleware function for error handling or passing control to the next middleware.
 * @returns {JSON} - Success response with the new admin's data and a JWT token if creation is successful.
 * @throws {Error} - If validation or business logic errors occur, returns a formatted error message.
 */
export const createAdmin = async (req, res, next) => {
  let errors = [];

  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    errors = validationErrors.array().map(err => ({
      field: err.param,
      message: err.msg,
    }));
  }

  const {
    firstName,
    lastName,
    username,
    email,
    phoneNumber,
    password,
    role, // Optional, defaults to 'admin'
    permissions, // Optional, defaults based on role
    profileImage, // Optional field
  } = req.body;

  try {
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }, { phoneNumber }]
    });

    if (existingAdmin) {
      if (existingAdmin.username === username) {
        errors.push({ field: 'username', message: 'Username is already in use' });
      }
      if (existingAdmin.email === email) {
        errors.push({ field: 'email', message: 'Email is already in use' });
      }
      if (existingAdmin.phoneNumber === phoneNumber) {
        errors.push({ field: 'phoneNumber', message: 'Phone number is already in use' });
      }
    }

    if (errors.length > 0) {
      return next(formatError('Validation or business logic errors occurred.', errors, 400));
    }

    // Create a new admin with the provided and default fields
    const newAdmin = new Admin({
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      password,
      role: role || 'admin', // Default role is 'admin'
      permissions, // If permissions are provided, use them, otherwise default to role-based permissions
      profileImage, // Include profileImage if provided
    });

    await newAdmin.save();

    const token = generateJWT(newAdmin, newAdmin.role);

    setTokenCookie(res, token);

    return res.status(201).json({
      success: true,
      message: 'Admin created successfully.',
      data: newAdmin,
    });
  } catch (error) {
    return next(formatError('Server error while creating admin', [], 500));
  }
};

/**
 * @desc    Handles admin login using the 'admin-local' passport strategy.
 *          If authentication is successful, generates a JWT and returns it as a cookie.
 * @route   POST /api/admin/login
 * @access  Public
 * @param   {Object} req - Express request object containing email and password.
 * @param   {Object} res - Express response object for sending responses.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - Success message with admin details and JWT token in a cookie.
 * @throws  {Error} - Authentication error if the credentials are incorrect or server error occurs.
 */
export const loginAdmin = (req, res, next) => {
  passport.authenticate('admin-local', { session: false }, (err, admin, info) => {
    if (err) {
      return next(err);  // Pass Server Error to the global error handler
    }

    if (!admin) {
      return next(info);  // Pass Authentication Error to the global error handler
    }

    const token = generateJWT(admin, admin.role);  // Generate the JWT for the admin
    setTokenCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Admin logged in successfully!',
      data: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
      },
    });
  })(req, res, next);
};


/**
 * @desc    Retrieves all admin users from the database, excluding their passwords.
 * @route   GET /api/admin
 * @access  Private (Admin)
 * @param   {Object} req - Express request object containing the user's authentication details.
 * @param   {Object} res - Express response object for sending the list of admins.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - JSON response with the success status and list of all admin users.
 * @throws  {Error} - If any database or server error occurs.
 */
export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().select('-password'); // Exclude the password field

    if (!admins || admins.length === 0) {
      return next(formatError('No admins found', [], 404));
    }

    return res.status(200).json({
      success: true,
      data: admins,
    });

  } catch (error) {
    return next(formatError('Server error while fetching admins', [], 500, error));
  }
};

/**
 * @desc    Get a specific admin by ID from the database.
 *          Returns admin data except for the password field.
 * @route   GET /api/admin/:id
 * @access  Private (Admin)
 * @param   {Object} req - Express request object containing the admin ID in params.
 * @param   {Object} res - Express response object for sending the admin data.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - Success response with admin data or formatted error.
 * @throws  {Error} - 404 if admin is not found, 500 for server errors.
 */
export const getAdminById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
      return next(formatError('Invalid agent ID', [], 400));
    }

    const admin = await Admin.findById(req.params.id).select('-password');

    if (!admin) {
      return next(formatError('Admin not found', [], 404));
    }

    return res.status(200).json({
      success: true,
      data: admin,
    });

  } catch (error) {
    return next(formatError('Error retrieving admin', [], 500, error));
  }
};

/**
 * @desc    Update a specific admin's information in the database.
 *          Prevents updates to restricted fields like "role" and excludes the password from the response.
 * @route   PUT /api/admin/:id
 * @access  Private (Admin or Super Admin)
 * @param   {Object} req - Express request object containing the admin ID in params and updated data in the body.
 * @param   {Object} res - Express response object for sending the updated admin data.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - Success response with updated admin data or formatted error.
 * @throws  {Error} - 404 if admin is not found, 400 for validation errors, 500 for server errors.
 */
export const updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if the ID is a valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
      return next(formatError('Invalid admin ID', [], 400));
    }

    // Extract the validation errors from the request
    const validationErrors = validationResult(req);
    let errors = [];

    if (!validationErrors.isEmpty()) {
      errors = validationErrors.array().map(err => ({
        field: err.param,
        message: err.msg,
      }));
    }

    // Prevent updates to the role unless the user is super-admin
    if (updates.role && req.user.role !== 'super-admin') {
      errors.push({
        field: 'role',
        message: 'You are not allowed to update the role.',
      });
      delete updates.role; // Remove role from updates to avoid applying it.
    }

    // Stop the process if any validation errors exist
    if (errors.length > 0) {
      return next(formatError('Validation failed for some fields.', errors, 400));
    }

    // Attempt to find and update the admin
    const updatedAdmin = await Admin.findByIdAndUpdate(id, updates, {
      new: true, // Return the updated document
      runValidators: true, // Apply schema validations for fields like email and phone number
    }).select('-password'); // Exclude password from the response

    if (!updatedAdmin) {
      return next(formatError('Admin not found', [], 404));
    }

    return res.status(200).json({
      success: true,
      message: 'Admin information updated successfully.',
      data: updatedAdmin,
    });

  } catch (error) {
    // Catch Mongoose validation errors
    if (error.name === 'ValidationError') {
      const mongooseErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message,
      }));
      return next(formatError('Validation failed for some fields.', mongooseErrors, 400));
    }

    // Catch and handle other server-side errors
    return next(formatError('Server error while updating admin information', [], 500));
  }
};

/**
 * @desc    Delete a specific admin from the database.
 *          Returns success message upon successful deletion or error if admin not found.
 * @route   DELETE /api/admin/:id
 * @access  Private (Super Admin)
 * @param   {Object} req - Express request object containing the admin ID in params.
 * @param   {Object} res - Express response object for sending the deletion result.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - Success message or formatted error.
 * @throws  {Error} - 404 if admin is not found, 500 for server errors.
 */
export const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
      return next(formatError('Invalid admin ID', [], 400));
    }

    // Find the admin by the provided ID
    const adminToDelete = await Admin.findById(id);

    if (!adminToDelete) {
      return next(formatError('Admin not found', [], 404));
    }

    await adminToDelete.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Admin deleted successfully!',
   });
  } catch (error) {
    // Handle any server-side errors
    return next(formatError('Server error while deleting admin', [], 500));
  }
};