/**
 * This file contains the validation services
 */

import User from '../models/User.js';
import { BusinessLogicError } from '../utils/customErrors.js';

/**
 * Service to check if a username is available.
 * @param {string} username - The username to check.
 * @throws {BusinessLogicError} - Throws an error if the username is already taken.
 */
export const isUsernameAvailable = async (username) => {
  const existingUser = await User.findOne({ username });
  
  if (existingUser) {
    throw new BusinessLogicError('This username is unavailable.');
  }
  
  return true; // Username is available
};

/**
 * Service to check if an email is already registered.
 * @param {string} email - The email to check.
 * @throws {BusinessLogicError} - Throws an error if the email is already registered.
 */
export const isEmailAvailable = async (email) => {
  const existingUser = await User.findOne({ email });
  
  if (existingUser) {
    throw new BusinessLogicError('This email is unavailable.');
  }
  
  return true; // Email is available
};
