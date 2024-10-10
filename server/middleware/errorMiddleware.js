const errorHandler = (err, req, res, next) => {
    // Set default status code and message
    let statusCode = err.statusCode || 500;  // Default to 500 if status is not set
    let message = err.message || 'Internal Server Error';
  
    // Log the error stack for debugging (only log full stack in development)
    if (process.env.NODE_ENV === 'development') {
      console.error(err.stack);
    }
  
    // Handle different types of errors
    if (err.name === 'ValidationError') {
      statusCode = 400;  // Bad request for validation errors
      message = err.message || 'Validation Error';
    } else if (err.name === 'CastError') {
      statusCode = 400;  // Invalid ID format for MongoDB ObjectId, for example
      message = `Invalid ${err.path}: ${err.value}`;
    } else if (err.name === 'UnauthorizedError') {
      statusCode = 401;  // JWT or authorization failure
      message = 'Unauthorized access';
    }
  
    // Customize the response depending on environment
    if (process.env.NODE_ENV === 'development') {
      return res.status(statusCode).json({
        success: false,
        error: {
          message,
          stack: err.stack,  // Include stack trace in development
        },
      });
    } else {
      return res.status(statusCode).json({
        success: false,
        error: {
          message,           // Do not expose stack trace in production
        },
      });
    }
  };
  
  export default errorHandler;
  