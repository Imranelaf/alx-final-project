import {excludeSensitiveInfo} from '../../utils/excludeSensitiveInfo.js';
import {
  getUsersByFilterService, 
  getUserByIdService,
  deleteUserService,
  updateUserService,
} from '../../services/userServices.js';

/**
 * @desc    Controller to handle retrieving all or filtered users from the database.
 * @param   {Object} req - Express request object.
 * @param   {Object} res - Express response object used to send the list of users.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - JSON response with the success status and list of users.
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
 * @desc    Get a specific user by ID from the database.
 *          Returns user data except for the password field.
 * @route   GET /api/user/:id
 * @access  Private (User/Admin)
 * @param   {Object} req - Express request object containing the user ID in params.
 * @param   {Object} res - Express response object for sending the user data.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - Success response with user data or formatted error.
 */
export const getUserById = async (req, res, next) => {
    try {
      const { id } = req.params; // Extract user ID from params
  
      // Call the service to get user by ID
      const user = await getUserByIdService(id);
  
      // Sanitize user data (exclude sensitive fields like password)
      const sanitizedUser = excludeSensitiveInfo(user, ['password', '__v']);
  
      return res.status(200).json({
        success: true,
        data: sanitizedUser,
      });
    } catch (error) {
      return next(error); // Pass error to global error handler
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
      const { id } = req.params; // Extract user ID from the request params
      const updates = req.body;  // Extract the updates from the request body
      const userRole = req.user.role;  // Get the user's role from the JWT payload
  
      // Call the service to update the user
      const updatedUser = await updateUserService(id, updates, userRole);
  
      // Exclude sensitive fields like password before sending the response
      const sanitizedUpdatedUser = excludeSensitiveInfo(updatedUser, ['password', '__v']);
  
      return res.status(200).json({
        success: true,
        message: 'User information updated successfully.',
        data: sanitizedUpdatedUser,
      });
    } catch (error) {
      return next(error);  // Pass the error to the global error handler
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
    // Extract user ID from request parameters
    const { id } = req.params;

    // Call the service to handle user deletion
    await deleteUserService(id);

    // Send success response after user is deleted
    return res.status(200).json({
      success: true,
      message: 'User deleted successfully!',
    });
  } catch (error) {
    // Pass the error to the global error handler
    return next(error);
  }
};
