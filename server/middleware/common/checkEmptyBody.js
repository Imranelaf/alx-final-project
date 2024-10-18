/**
 * This file contains a middleware function to check if the request body is empty.
 */

import { formatError } from '../../utils/errorFormatter.js';

/**
 * @desc Middleware to check if the request body is empty and format the error using `errorFormatter`.
 *       This is reusable across different routes and contexts.
 * @param {String} message - Custom error message to return when the body is empty.
 * @returns {Function} - Middleware function to handle the empty body check.
 */
const checkEmptyBody = (message = 'Request body is empty. Please provide valid data.') => {
  return (req, res, next) => {
    // Check if the request body is empty
    if (Object.keys(req.body).length === 0) {
      const error = formatError(message, [], 400);
      return next(error);
    }
    next();
  };
};

export default checkEmptyBody;
