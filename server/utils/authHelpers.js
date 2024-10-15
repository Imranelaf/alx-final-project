import jwt from 'jsonwebtoken';
import { ValidationError } from '../utils/customErrors.js';

export const generateJWT = (user) => {
  console.log('User object received in generateJWT:', JSON.stringify(user, null, 2));
  if (!user || !user._id || !user.username || !user.email || !user.role) {
    throw new ValidationError('Invalid user object provided to generateJWT', [
      { field: '_id', message: 'User ID is missing' },
      { field: 'username', message: 'Username is missing' },
      { field: 'email', message: 'Email is missing' },
      { field: 'role', message: 'Role is missing' }
    ].filter(error => !user || !user[error.field]));
  }

  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN || '3d',
    issuer: process.env.JWT_ISSUER || 'propertyHub',
    audience: process.env.JWT_AUDIENCE || 'propertyHubApp',
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

/**
 * Generate a token and cookie options for a user
 * @param {Object} user - The user object
 * @returns {Object} An object containing the token and cookie options
 */
export const generateTokenAndCookieOptions = (user) => {
  const token = generateJWT(user);
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  };
  return { token, cookieOptions };
};

/**
 * Set the JWT token in a cookie
 * @param {Object} res - The response object
 * @param {string} token - The JWT token
 * @param {Object} cookieOptions - The cookie options
 */
export const setTokenCookie = (res, token, cookieOptions) => {
  if (!res || !token || !cookieOptions) {
    throw new Error('Invalid parameters provided to setTokenCookie');
  }
  res.cookie('propertyHubAuthToken', token, cookieOptions);
};

/**
 * Verify and decode a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {Object} The decoded token payload
 * @throws {Error} If the token is invalid or expired
 */
export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};