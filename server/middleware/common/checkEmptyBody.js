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
      // Format and return the error
      const error = formatError(message, [], 400);  // Use `formatError` with the custom message
      return next(error);  // Pass the error to the global error handler
    }
    next();  // Proceed to the next middleware if the body isn't empty
  };
};

export default checkEmptyBody;
