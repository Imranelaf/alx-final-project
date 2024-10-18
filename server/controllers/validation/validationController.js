/**
 * This file contains the controllers for the validation routes.
 */

import { 
  isUsernameAvailable, 
  isEmailAvailable 
} from '../../services/validationServices.js';

/**
 * Controller to check if a username is available.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express middleware for error handling.
 */
export const checkUsername = async (req, res, next) => {
  const { username } = req.params;

  try {
    await isUsernameAvailable(username); 

    return res.status(200).json({ success: true, message: 'Username is available.' });
  } catch (error) {
    return next(error);
  }
};

/**
 * Controller to check if an email is already registered.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express middleware for error handling.
 */
export const checkEmail = async (req, res, next) => {
  const { email } = req.params;

  try {
    await isEmailAvailable(email);

    return res.status(200).json({ success: true, message: 'Email is available.' });
  } catch (error) {
    return next(error);
  }
};
