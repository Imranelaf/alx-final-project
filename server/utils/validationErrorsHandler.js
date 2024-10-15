import { validationResult } from 'express-validator';
import { ValidationError } from '../utils/customErrors.js';

/**
 * Middleware to handle validation errors from express-validator.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Format validation errors: Each error includes only the field and its message
    const formattedErrors = errors.array().map(err => ({
      field: err.param,   // This will be the field name (like "email")
      message: err.msg,   // This will be the error message (like "Please provide a valid email address")
    }));

    // Pass the formatted errors to the global error handler
    return next(new ValidationError('Validation failed due to invalid inputs.', formattedErrors, 400));
  }

  // Proceed to the next middleware/controller if no validation errors
  next();
};
