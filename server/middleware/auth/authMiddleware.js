import jwt from 'jsonwebtoken';
import { formatError } from '../../utils/errorFormatter.js';

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
