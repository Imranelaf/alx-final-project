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
    expiresIn: process.env.JWT_EXPIRES_IN,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  };

  console.log('JWT payload:', payload);
  console.log('JWT options:', options);

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

export const generateTokenAndCookieOptions = (user) => {
  const token = generateJWT(user);
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
    name: process.env.JWT_COOKIE_NAME,
  };

  console.log('Generated token:', token);
  console.log('Cookie options:', cookieOptions);

  return { token, cookieOptions };
};

export const setTokenCookie = (res, token, cookieOptions) => {
  if (!res || !token || !cookieOptions) {
    throw new Error('Invalid parameters provided to setTokenCookie');
  }

  console.log('Setting token cookie. Token:', token);
  res.cookie(cookieOptions.name, token, cookieOptions);
};

export const verifyJWT = (token) => {
  try {
    console.log('Verifying token:', token);
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid or expired token');
  }
};