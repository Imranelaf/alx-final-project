import { formatError } from '../../utils/errorFormatter.js';

/**
 * @desc Middleware to check for required fields in different request locations (body, query, params).
 * @param {Object} requiredFields - An object that specifies required fields and where to look for them (body, query, params).
 * @returns {Function} Middleware function
 */
const checkRequiredFields = (requiredFields) => {
  return (req, res, next) => {
    const errors = [];

    // Loop through the specified required fields
    for (const [location, fields] of Object.entries(requiredFields)) {
      fields.forEach(field => {
        if (!req[location] || !req[location][field]) {
          errors.push({
            field,
            message: `${field} is required in ${location}.`,  // Dynamic error message
          });
        }
      });
    }

    // If errors are found, return the formatted error response
    if (errors.length > 0) {
      return next(formatError('Required fields missing', errors, 400));
    }

    // No errors, move to the next middleware
    next();
  };
};

export default checkRequiredFields;
