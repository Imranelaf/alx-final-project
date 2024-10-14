/*
Middleware for authenticating users via JWT, checking tokens in the Authorization header or cookies.
If valid, attaches user info to the request; otherwise, returns an error.
*/

import jwt from 'jsonwebtoken';
import { formatError } from '../../utils/errorFormatter.js';

/**
 * @desc Authenticates the user using a JWT token.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void} - Calls the next middleware if authentication is successful.
 * @throws {Error} - Returns 401 Unauthorized if the token is missing.
 * @throws {Error} - Returns 403 Forbidden if the token is invalid or expired.
 */
const authenticateJWT = (req, res, next) => {
  // Check if the token is sent in the Authorization header
  let token = req.header('Authorization')?.replace('Bearer ', '');

  // If not, check if the token is stored in a cookie
  if (!token) {
    token = req.cookies?.token;
  }

  // If no token is found, send a formatted error
  if (!token) {
    return next(formatError('Unauthorized access. Token is missing, please log in.', [], 401));
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach the decoded user info to `req.user`
    next(); // Continue to the next middleware/route handler
  } catch (error) {
    // If the token is invalid or expired, return a formatted error
    return next(formatError('Invalid token or session expired. Please log in again.', [], 403));
  }
};

export default authenticateJWT;
