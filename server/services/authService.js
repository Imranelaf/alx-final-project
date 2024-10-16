import Admin from '../models/Admin.js';
import Agent from '../models/Agent.js';
import User from '../models/User.js';
import generateUniqueUsername from '../utils/generateUniqueUsername.js'; // Default import
import { ServerError} from '../utils/customErrors.js';
import { BusinessLogicError } from '../utils/customErrors.js';

/**
 * Authenticate admin by email and password.
 * @param {string} email - Admin email.
 * @param {string} password - Admin password.
 * @throws {UnauthorizedError | ServerError} - Throws specific errors if authentication fails.
 * @returns {Object} - Authenticated admin.
 */
export const authenticateAdmin = async (email, password) => {
  try {
    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify the password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Return the authenticated admin if everything is fine
    return admin;

  } catch (error) {
    // Rethrow known errors or throw a generic server error
    if (error instanceof UnauthorizedError) {
      throw error;
    } else {
      throw new ServerError('Error during authentication');
    }
  }
};

/**
 * Business logic to authenticate an agent.
 * @param {String} email - The agent's email address.
 * @param {String} password - The agent's password.
 * @returns {Object} - Returns the authenticated agent or throws an error.
 */
export const authenticateAgent = async (email, password) => {
  try {
    // Find the agent by email
    const agent = await Agent.findOne({ email });

    if (!agent) {
      // Throw error instead of returning
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify the password
    const isPasswordValid = await agent.comparePassword(password);
    if (!isPasswordValid) {
      // Throw error instead of returning
      throw new UnauthorizedError('Invalid email or password');
    }

    // Return the authenticated agent
    return { agent };
  } catch (error) {
    // Only throw ServerError if the caught error isn't already a known custom error
    if (error instanceof UnauthorizedError) {
      throw error;  // Pass the specific UnauthorizedError
    }
    
    // For other unexpected errors, throw a ServerError
    throw new ServerError('Error during agent authentication');
  }
};

export const handleGoogleOAuthSignup = async (userProfile) => {
  const { googleId, firstName, lastName, email, avatar } = userProfile;

  try {
    // Check if the user already exists in the database by googleId OR email
    const existingUser = await User.findOne({
      $or: [{ googleId }, { email }]
    });

    if (existingUser) {
      // If user exists, return the user with a flag indicating it's an existing user
      return { user: existingUser, isExisting: true };
    }

    // Create a new user in the database with a default role
    const newUser = new User({
      firstName,
      lastName,
      email,
      googleId,
      avatar,
      role: 'user',  // Add a default role
      username: await generateUniqueUsername(firstName, lastName, email),
    });

    await newUser.save();

    // Return the newly created user object with a flag indicating it's a new user
    return { user: newUser, isExisting: false };
  } catch (error) {
    console.error('Error during Google OAuth signup service:', error);
    throw new BusinessLogicError('Error processing signup');
  }
};

/**
 * Service to handle Google OAuth sign-in logic.
 * @param {Object} userProfile - Google user profile object containing user data.
 * @returns {Object} - Returns the user object if the user exists, otherwise throws an error.
 */
export const handleGoogleOAuthSignin = async (userProfile) => {
  const { googleId, email } = userProfile;

  try {
    // Check if the user exists in the database by googleId OR email
    const existingUser = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!existingUser) {
      // Throw an error if the user is not found
      throw new BusinessLogicError('User not found, please sign up');
    }

    // Return the existing user object
    return existingUser;
  } catch (error) {
    console.error('Error during Google OAuth signin service:', error);
    throw new BusinessLogicError('Error processing signin');
  }
};

/**
 * Service to handle user login.
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @throws {UnauthorizedError | ServerError} - Throws an error if authentication fails or if a server error occurs.
 * @returns {Object} - The authenticated user.
 */
export const authenticateUserService = async (email, password) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If the user doesn't exist, throw UnauthorizedError
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if the password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Return the authenticated user
    return user;
  } catch (error) {
    // Catch unexpected server errors
    if (error instanceof UnauthorizedError) {
      throw error;
    } else {
      throw new ServerError('Server error during authentication');
    }
  }
};



