// utils/authHelpers.js
import jwt from 'jsonwebtoken';

// Helper function to generate JWT token
export const generateJWT = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Helper function to set the JWT token as a cookie
export const setTokenCookie = (res, token) => {
  res.cookie('propertyHubAuthToken', token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: false, // Set to true if served over HTTPS
    maxAge: 3600000, // 1 hour expiration
    sameSite: 'strict', // Ensures cookies are only sent in first-party contexts
  });
};
