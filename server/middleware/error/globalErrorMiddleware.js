import { ValidationError, BusinessLogicError, NotFoundError, ServerError, CustomError } from '../../utils/customErrors.js';

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    let errorResponse;

    // Check if it's one of our custom errors
    if (err instanceof CustomError) {
        errorResponse = err.toJSON();  // Use the custom error's toJSON method
    } else {
        // If it's an unknown error, wrap it in a generic ServerError
        const serverError = new ServerError('An unexpected error occurred');
        errorResponse = serverError.toJSON();

        // Optionally, log the original error in case it's unexpected
        console.error('Unexpected Error:', err);
    }

    // Log stack trace in development mode for easier debugging
    if (process.env.NODE_ENV === 'development') {
        console.error('Error Stack:', err.stack);
        errorResponse.error.stack = err.stack;  // Include the stack trace in development mode
    }

    // Ensure statusCode is set in case something went wrong
    const statusCode = errorResponse.statusCode || 500;

    // Send the formatted error response to the client
    return res.status(statusCode).json(errorResponse);
};

export default errorHandler;
