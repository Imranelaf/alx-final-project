/**
 *  This file contains the controller functions for handling admin user operations.
 */

import {excludeSensitiveInfo} from '../../utils/excludeSensitiveInfo.js';
import { 
  getAllAdminsService, 
  getAdminByIdService,
  deleteAdminService,
  updateAdminService,
 } from '../../services/adminService.js';

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

/**
 * @desc    Controller to get a specific admin by ID.
 * @route   GET /api/admin/:id
 *  @access  Private (Admin)
 * @param   {Object} req - Express request object containing the admin ID in the params.
 * @param   {Object} res - Express response object for sending the admin data.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - JSON response with the admin data or error message.
 */
export const getAdminById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const admin = await getAdminByIdService(id);

    const sanitizedAdmin = excludeSensitiveInfo(admin, ['password', '__v']);

    return res.status(200).json({
      success: true,
      data: sanitizedAdmin,
    });

  } catch (error) {
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
    const userRole = req.user.role;

    const updatedAdmin = await updateAdminService(id, updates, userRole);
    
    const sanitizedUpdatedAdmin = excludeSensitiveInfo(updatedAdmin, ['password', '__v']);


    return res.status(200).json({
      success: true,
      message: 'Admin information updated successfully.',
      data: sanitizedUpdatedAdmin,
    });
  } catch (error) {
    return next(error);
  }
};
