import User from '../models/User.js';
import { 
  BusinessLogicError, 
  ServerError, 
  NotFoundError, 
  ValidationError,
  MongooseValidationError 
} from '../utils/customErrors.js';
import { checkDuplicateFields } from '../utils/checkDuplicateFields.js';
import { removeRestrictedFields } from '../utils/removeRestrictedFields.js';

/**
 * Business logic to create a new user.
 * @param {Object} userData - The data for creating the new user.
 * @throws {BusinessLogicError | ServerError} - Throws errors if something goes wrong.
 * @returns {Object} - The newly created user.
 */
export const createNewUser = async (userData) => {
  try {
    const { firstName, lastName, username, email, password } = userData;

    // Check for duplicate fields (email, username)
    const duplicateErrors = await checkDuplicateFields(User, { email, username });

    // If duplicates are found, throw BusinessLogicError
    if (duplicateErrors.length > 0) {
      throw new BusinessLogicError('Duplicate fields found', duplicateErrors);
    }

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password, // Password will be hashed automatically before saving
      role: 'user', // Default role is 'user'
    });

    // Save the new user to the database
    await newUser.save();

    // Return the newly created user
    return newUser;

  } catch (error) {
    // Throw any error to be caught by the controller
    if (error instanceof BusinessLogicError) {
      throw error;
    } else {
      throw new ServerError('Error creating user'); // Default to ServerError for unexpected errors
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

    // Fetch users from the database based on the query
    const users = await User.find(query);

    // Return the array of users
    return users;

  } catch (error) {
    // Handle unexpected errors
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
    // Fetch user by ID
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }

    return user; // Return raw user data
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error; // Pass specific NotFoundError
    }

    // Wrap any unexpected errors in a ServerError
    throw new ServerError('Error while fetching user', 500);
  }
};

/**
 * Service to update a specific user's information.
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
    // List of fields that cannot be modified
    const restrictedFields = ['role', 'accountStatus', 'createdAt', 'lastLogin'];
    
    const sanitizedUpdates = removeRestrictedFields(updates, restrictedFields);

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(id, sanitizedUpdates, {
      new: true,  // Return the updated document
      runValidators: true,  // Apply schema validations
    });

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    return updatedUser;

  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      throw new MongooseValidationError(error);
    } else if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;  // Rethrow known errors
    }

    // Handle any unexpected server-side errors
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
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Delete the user
    await user.deleteOne();
  } catch (error) {
    // Handle specific errors or throw ServerError for unexpected cases
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ServerError('Error deleting user');
  }
};

