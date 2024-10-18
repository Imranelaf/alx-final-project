/**
 * This file contains the controllers for user management in the system.
 */

// Utility functions
import { excludeSensitiveInfo } from '../../utils/excludeSensitiveInfo.js';

// Service functions
import {
  getUsersByFilterService,
  getUserByIdService,
  deleteUserService,
  updateUserService,
  addPropertyToUserService,
  removePropertyFromUserService,
} from '../../services/userServices.js';

/**
 * @desc    Controller to retrieve users based on query parameters (filters) or return all users if no filters are provided.
 *          This route is public, meaning it doesn't require authentication.
 * @route   GET /api/users
 * @access  Public
 * @param   {Object} req - Express request object containing query parameters for filtering.
 * @param   {Object} res - Express response object used to send the list of filtered users or all users.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - Success response with a list of users or an error.
 */
export const getUsersByFilter = async (req, res, next) => {
  try {
    const filters = req.query;
    const users = await getUsersByFilterService(filters);

    const sanitizedUsers = users.map(user => excludeSensitiveInfo(user, ['password', '__v']));

    return res.status(200).json({
      success: true,
      data: sanitizedUsers,
    });

  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Controller to retrieve a specific user by ID from the database.
 * @route   GET /api/users/:id
 * @access  Public
 * @param   {Object} req - Express request object containing the user ID in params.
 * @param   {Object} res - Express response object for sending the user data.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - Success response with user data or formatted error.
 */
export const getUserById = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const user = await getUserByIdService(id);
  
      const sanitizedUser = excludeSensitiveInfo(user, ['password', '__v']);
  
      return res.status(200).json({
        success: true,
        data: sanitizedUser,
      });
    } catch (error) {
      return next(error);
    }
};

/**
 * @desc    Controller to update a specific user's information.
 * @route   PUT /api/user/:id
 * @access  Private (User or Admin)
 * @param   {Object} req - Express request object containing the user ID in params and updated data in the body.
 * @param   {Object} res - Express response object for sending the updated user data.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - Success response with updated user data or error.
 */
export const updateUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const userRole = req.user.role;
  
      const updatedUser = await updateUserService(id, updates, userRole);
  
      const sanitizedUpdatedUser = excludeSensitiveInfo(updatedUser, ['password', '__v']);
  
      return res.status(200).json({
        success: true,
        message: 'User information updated successfully.',
        data: sanitizedUpdatedUser,
      });
    } catch (error) {
      return next(error); 
    }
};

/**
 * @desc    Controller to delete a user by ID.
 * @route   DELETE /api/users/:id
 * @access  Private (Admin)
 * @param   {Object} req - Express request object containing the user ID in the params.
 * @param   {Object} res - Express response object used to send the deletion result.
 * @param   {Function} next - Express middleware function for error handling.
 * @returns {JSON} - Success message or error response.
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await deleteUserService(id);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully!',
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Controller to add a property to a user's properties array.
 * @route   POST /api/users/:userId/add-property
 * @access  Private (User or Admin)
 * @param   {Object} req - Express request object containing userId in params and propertyId in the body.
 * @param   {Object} res - Express response object used to send the updated user data.
 * @param   {Function} next - Express middleware function for error handling.
 * @returns {JSON} - Success response with the updated user data.
 */
export const addPropertyToUser = async (req, res, next) => {
  const { userId } = req.params;
  const { propertyId } = req.body;

  try {
    const updatedUser = await addPropertyToUserService(userId, propertyId);

    return res.status(200).json({
      success: true,
      message: 'Property added to user successfully.',
      data: updatedUser,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Controller to handle removing a property from a user.
 * @param {Object} req - Express request object containing userId in params and propertyId in body.
 * @param {Object} res - Express response object for sending the result of the removal process.
 * @param {Function} next - Express middleware function for error handling.
 */
export const removePropertyFromUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { propertyId } = req.body;

    const updatedUser = await removePropertyFromUserService(userId, propertyId);

    return res.status(200).json({
      success: true,
      message: 'Property removed from user successfully.',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};
