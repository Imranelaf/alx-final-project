/*
Controller functions for managing admin operations such as creating, updating, deleting admins, and
handling admin authentication. Includes JWT generation and error handling.
*/

import Admin from '../../models/Admin.js';
import { validationResult } from 'express-validator';
import { generateJWT, setTokenCookie } from '../../utils/authHelpers.js';
import passport from 'passport';
import '../../config/passport.js';
import { formatError } from '../../utils/errorFormatter.js';

/**
 * @desc    Creates a new admin and saves it to the database. 
 *          If validation fails or the email/phone already exists, an error is returned.
 * @route   POST /api/admin
 * @access  Private (Super Admin)
 * @param   {Object} req - Express request object containing admin fields (firstName, lastName, email, etc.)
 * @param   {Object} res - Express response object for sending responses.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - Success message with admin details and JWT token in a cookie.
 * @throws  {Error} - Validation error if the fields are incorrect or email/phone is already registered.
 */
export const createAdmin = async (req, res, next) => {
  const validationErrors = validationResult(req);
  let errors = [];

  if (!validationErrors.isEmpty()) {
    errors = validationErrors.array().map(err => ({
      field: err.path, 
      message: err.msg,
    }));
  }

  const { firstName, lastName, email, password, phoneNumber, role } = req.body;

  try {
    // Check if an admin with this email or phone number already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingAdmin) {
      if (existingAdmin.email === email) {
        errors.push({ field: 'email', message: 'Email is already registered.' });
      }
      if (existingAdmin.phoneNumber === phoneNumber) {
        errors.push({ field: 'phoneNumber', message: 'Phone number is already registered.' });
      }
    }

    if (errors.length > 0) {
      return next(formatError('Validation failed', errors, 400));
    }

    // Create the new admin
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password, // Password will be hashed via the pre-save hook
      phoneNumber,
      role, // Can be 'admin' or 'super-admin'
    });

    await newAdmin.save();

    // Generate JWT for the new admin and set cookie
    const token = generateJWT(newAdmin, role);
    setTokenCookie(res, token);

    return res.status(201).json({
      success: true,
      message: 'Admin created successfully!',
      data: {
        id: newAdmin._id,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    return next(error);
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

    // Generate JWT and set it as a cookie
    const token = generateJWT(admin, admin.role);  // Generate the JWT for the admin
    setTokenCookie(res, token);  // Set the JWT as a cookie

    // Return success response with admin data
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

    // Check if no admins were found
    if (!admins || admins.length === 0) {
      return next(formatError('No admins found', [], 404));
    }

    // Return the list of admins if found
    return res.status(200).json({
      success: true,
      data: admins,
    });

  } catch (error) {
    // Pass a formatted error using formatError
    return next(formatError('Error retrieving admins from the database', [], 500, error));
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
    // Find admin by ID and exclude the password field
    const admin = await Admin.findById(req.params.id).select('-password');

    // Check if admin is not found
    if (!admin) {
      return next(formatError('Admin not found', [], 404));
    }

    // Return the admin data
    return res.status(200).json({
      success: true,
      data: admin,
    });

  } catch (error) {
    // Pass a formatted error for any server issues
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

    // Extract the validation errors from the request
    const validationErrors = validationResult(req);
    let errors = [];

    // Handle express-validator errors
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

    // If admin not found, return a 404 error
    if (!updatedAdmin) {
      return next(formatError('Admin not found', [], 404));
    }

    // Return success response with the updated fields
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

    // Find the admin by the provided ID
    const adminToDelete = await Admin.findById(id);

    // If admin not found, return a 404 error
    if (!adminToDelete) {
      return next(formatError('Admin not found', [], 404));
    }

    // Perform the deletion
    await adminToDelete.deleteOne();

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Admin deleted successfully!',
   });
  } catch (error) {
    // Handle any server-side errors
    return next(formatError('Server error while deleting admin', [], 500));
  }
};