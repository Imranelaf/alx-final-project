import { validationResult } from 'express-validator';
import { formatError } from '../../utils/errorFormatter.js';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
    }));

    // Forward the formatted error to the global error handler
    const error = formatError('Validation failed', formattedErrors, 400);
    return next(error);  // Pass to global error handler
  }

  // No validation errors, proceed to next middleware or controller
  next();
};
