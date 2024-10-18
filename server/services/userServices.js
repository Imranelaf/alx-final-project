/**
 * This file contains the services for user management in the system.
 * It handles business logic for creating, updating, retrieving, and deleting users.
 */

import User from '../models/User.js';

// Utility imports
import { checkDuplicateFields } from '../utils/checkDuplicateFields.js';
import { removeRestrictedFields } from '../utils/removeRestrictedFields.js';

// Custom error imports
import { 
  BusinessLogicError, 
  ServerError, 
  NotFoundError, 
  ValidationError,
  MongooseValidationError 
} from '../utils/customErrors.js';


/**
 * Business logic to create a new user.
 * @param {Object} userData - The data for creating the new user.
 * @throws {BusinessLogicError | ServerError} - Throws errors if something goes wrong.
 * @returns {Object} - The newly created user.
 */
export const createNewUser = async (userData) => {
  try {
    const { firstName, lastName, username, email, password } = userData;

    const duplicateErrors = await checkDuplicateFields(User, { email, username });

    if (duplicateErrors.length > 0) {
      throw new BusinessLogicError('Duplicate fields found', duplicateErrors);
    }

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password, // Password will be hashed automatically before saving
      role: 'user',
    });

    await newUser.save();

    return newUser;

  } catch (error) {
    if (error instanceof BusinessLogicError) {
      throw error;
    } else {
      throw new ServerError('Error creating user');
    }
  }
};

/**
 * @desc    Service to fetch users based on filters, or return all users if no filters are provided.
 * @param   {Object} filters - Query parameters used for filtering users.
 * @returns {Array} - Array of users that match the filters or all users if no filters are applied.
 */
export const getUsersByFilterService = async (filters) => {
  try {
    const query = {};

    if (filters.firstName) {
      query.firstName = { $regex: filters.firstName, $options: 'i' }; // Case-insensitive match
    }

    if (filters.lastName) {
      query.lastName = { $regex: filters.lastName, $options: 'i' };
    }

    if (filters.username) {
      query.username = { $regex: filters.username, $options: 'i' };
    }

    if (filters.email) {
      query.email = { $regex: filters.email, $options: 'i' };
    }

    if (filters.accountStatus) {
      query.accountStatus = filters.accountStatus;  // Match exact account status
    }

    const users = await User.find(query);

    return users;

  } catch (error) {
    throw new ServerError('Error fetching users from the database');
  }
};

/**
 * Service to retrieve a user by their ID from the database.
 * @param {string} userId - The ID of the user to be fetched.
 * @returns {Object} - Returns the user object if found.
 * @throws {NotFoundError} - If the user is not found.
 * @throws {ServerError} - For other server errors.
 */
export const getUserByIdService = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }

    return user;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }

    throw new ServerError('Error while fetching user', 500);
  }
};

/**
 * @param {string} id - The user's ID.
 * @param {Object} updates - The updates to be applied to the user.
 * @param {string} userRole - The role of the user making the update request (either 'user' or 'admin').
 * @throws {ValidationError} - If the ID or fields are invalid.
 * @throws {NotFoundError} - If the user is not found.
 * @throws {ForbiddenError} - If the user is not allowed to update 'role' or 'accountStatus'.
 * @throws {ServerError} - For any server-side errors that occur.
 * @returns {Object} - The updated user object.
 */
export const updateUserService = async (id, updates, userRole) => {
  try {
    const restrictedFields = ['role', 'accountStatus', 'createdAt', 'lastLogin'];
    
    const sanitizedUpdates = removeRestrictedFields(updates, restrictedFields);

    const updatedUser = await User.findByIdAndUpdate(id, sanitizedUpdates, {
      new: true,  // Return the updated document
      runValidators: true,  // Apply schema validations
    });

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    return updatedUser;

  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new MongooseValidationError(error);
    } else if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }

    throw new ServerError('Server error while updating user information');
  }
};

/**
 * Service to delete a user by ID.
 * @param {string} id - The user's ID from the request parameters.
 * @throws {ValidationError} - If the ID is not a valid MongoDB ObjectId.
 * @throws {NotFoundError} - If the user with the provided ID is not found.
 * @throws {ServerError} - For any server errors that occur.
 */
export const deleteUserService = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await user.deleteOne();
  } catch (error) {
    // Handle specific errors or throw ServerError for unexpected cases
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ServerError('Error deleting user');
  }
};

/**
 * Service to add a property to a user's properties array.
 * @param {string} userId - The user's ID (from the URL).
 * @param {string} propertyId - The property ID to add (from the body).
 * @throws {NotFoundError} - If the user is not found.
 * @throws {BusinessLogicError} - If the property already exists in the user's properties array.
 * @throws {ServerError} - If an error occurs during the update.
 * @returns {Object} - The updated user object.
 */
export const addPropertyToUserService = async (userId, propertyId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if the property already exists in the user's properties array
    if (user.properties.includes(propertyId)) {
      throw new BusinessLogicError('Property already added to user.');
    }

    // Add the property ID to the user's properties array
    user.properties.push(propertyId);

    // Save the updated user
    await user.save();
    
    return user;
  } catch (error) {
    // Throw a specific error if known or a generic server error
    if (error instanceof NotFoundError || error instanceof BusinessLogicError) {
      throw error;
    } else {
      throw new ServerError('Error updating user properties');
    }
  }
};

/**
 * Service to remove a property from a user's properties array.
 * @param {string} userId - The user's ID (from the URL).
 * @param {string} propertyId - The property ID to remove (from the body).
 * @throws {NotFoundError} - If the user is not found.
 * @throws {BusinessLogicError} - If the property does not exist in the user's properties array.
 * @throws {ServerError} - If an error occurs during the update.
 * @returns {Object} - The updated user object.
 */
export const removePropertyFromUserService = async (userId, propertyId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.properties.includes(propertyId)) {
      throw new BusinessLogicError('Property not found in user\'s properties.');
    }

    user.properties = user.properties.filter(prop => prop.toString() !== propertyId);

    await user.save();
    
    return user;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BusinessLogicError) {
      throw error;
    } else {
      throw new ServerError('Error removing property from user');
    }
  }
};
