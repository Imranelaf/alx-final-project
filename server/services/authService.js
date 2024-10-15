import { UnauthorizedError, ServerError } from '../utils/customErrors.js';
import Admin from '../models/Admin.js';
import Agent from '../models/Agent.js';


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

