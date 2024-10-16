/**
 * Formats errors for consistent API response.
 * @param {string} message - A general error message.
 * @param {array} errors - Optional array of field-specific errors.
 * @param {number} statusCode - Optional HTTP status code (default 400).
 */
export const formatError = (message, errors = [], statusCode = 400) => {
  return {
    success: false,
    error: {
      message,
      errors: errors.length > 0 ? errors : undefined,  // Only include errors if there are any
    },
    statusCode,
  };
};
