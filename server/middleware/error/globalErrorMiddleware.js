/**
 * This middleware is used to catch all errors that are thrown in the application.
 */

import { ValidationError, BusinessLogicError, NotFoundError, ServerError, CustomError } from '../../utils/customErrors.js';

/**
 * 
 * @param {*} err
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const errorHandler = (err, req, res, next) => {
    let errorResponse;

    if (err instanceof CustomError) {
        errorResponse = err.toJSON();
    } else {
        // If it's an unknown error, wrap it in a generic ServerError
        const serverError = new ServerError('An unexpected error occurred');
        errorResponse = serverError.toJSON();

        console.error('Unexpected Error:', err);
    }

    if (process.env.NODE_ENV === 'development') {
        console.error('Error Stack:', err.stack);
        errorResponse.error.stack = err.stack;
    }

    // Ensure statusCode is set in case something went wrong
    const statusCode = errorResponse.statusCode || 500;

    // Send the formatted error response to the client
    return res.status(statusCode).json(errorResponse);
};

export default errorHandler;
