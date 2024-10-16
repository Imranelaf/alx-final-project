import User from '../models/User.js';
import { BusinessLogicError, ServerError } from '../utils/customErrors.js';
import { checkDuplicateFields } from '../utils/checkDuplicateFields.js';

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
