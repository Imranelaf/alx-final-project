/*
Utility functions for generating JWT tokens and setting them as cookies for authentication and session management.
*/

import jwt from 'jsonwebtoken';

/**
 * @desc    Generates a JWT token for the authenticated user with their role.
 * @param   {Object} user - The user object from MongoDB.
 * @param   {string} role - The role of the user (default is 'user').
 * @returns {string} - A signed JWT token containing the user's ID, username, email, and role.
 */
export const generateJWT = (user, role = 'user') => {
  return jwt.sign(
    { 
      id: user._id, 
      username: user.username, 
      email: user.email, 
      role // Include role in the payload
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

/**
 * @desc    Sets the generated JWT token as an HTTP-only cookie.
 * @param   {Object} res - Express response object to set the cookie.
 * @param   {string} token - The JWT token to be set as a cookie.
 * @returns {void}
 */
export const setTokenCookie = (res, token) => {
  res.cookie('propertyHubAuthToken', token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: false, // Set to true if served over HTTPS
    maxAge: 3600000, // 1 hour expiration
    sameSite: 'strict', // Ensures cookies are only sent in first-party contexts
  });
};
