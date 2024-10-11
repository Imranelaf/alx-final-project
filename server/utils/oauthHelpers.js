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
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    maxAge: 3600000, // 1 hour expiration
    sameSite: 'strict',
  });
};

// Helper function to send user data as JSON response
export const sendUserResponse = (res, user, message, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    },
  });
};
