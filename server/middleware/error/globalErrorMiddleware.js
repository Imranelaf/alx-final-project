import { formatError } from '../../utils/errorFormatter.js';

// Error handler middleware to catch all errors and format them
const errorHandler = (err, req, res, next) => {
  // If the error is already formatted, send it directly
  if (err.success === false && err.error) {
    return res.status(err.statusCode || 500).json(err);
  }

  // If the error is not formatted, apply custom logic
  let statusCode = err.statusCode || 500; // Default to 500 (Internal Server Error)
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || []; // Field-specific errors, if any

  // Handle specific error types and adjust message and status code
  switch (err.name) {
    case 'ValidationError':
      statusCode = 400;
      message = 'Validation failed';
      if (!errors.length) {
        errors = Object.values(err.errors).map(e => ({
          field: e.path,
          message: e.message,
        }));
      }
      break;

    case 'CastError':  // MongoDB invalid ObjectId error
      statusCode = 400;
      message = `Invalid ${err.path}: ${err.value}`;
      break;

    case 'UnauthorizedError':  // JWT or authentication errors
      statusCode = 401;
      message = 'Unauthorized access';
      break;

    default:
      break;
  }

  // Use formatError utility to format the error consistently
  const response = formatError(message, errors, statusCode);

  // Log stack trace in development mode for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Stack:', err.stack);
    response.error.stack = err.stack; // Include the stack trace in development mode
  }

  // Send the formatted error response
  return res.status(statusCode).json(response);
};

export default errorHandler;
