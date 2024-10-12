import User from '../../models/User.js';
import { validationResult } from 'express-validator';
import { generateJWT, setTokenCookie } from '../../utils/authHelpers.js';
import { formatError } from '../../utils/errorFormatter.js';  // Import the formatError utility

export const signupUser = async (req, res, next) => {
  // Extract validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Use formatError to pass validation errors to the global error handler
    // Format the error to respect the errorFormatter utility format
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
    }));
    return next(formatError('Validation failed', formattedErrors, 400));
  }

  const { firstName, lastName, username, email, password } = req.body;

  try {
    // Check if the email or username is already taken
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      const errorMessage = existingUser.email === email
        ? 'Email is already registered.'
        : 'Username is already taken.';

      // Use formatError to standardize the error format
      return next(formatError(errorMessage, [], 400));
    }

    // Create the new user
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password, // Password will be hashed in the User model
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT for immediate login
    const token = generateJWT(newUser);

    // Set the JWT token as a cookie
    setTokenCookie(res, token);

    // Return success response
    return res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
      },
    });

  } catch (error) {
    // Catch any server errors and pass them to the global error handler
    return next(formatError('Server error during registration', [], 500));
  }
};

export const authenticateUser = async (req, res, next) => {
  try {
    // Passport.js attaches the authenticated user to req.user
    const user = req.user; 

    if (!user) {
      return next(formatError('Authentication failed. No user found.', [], 401));
    }

    // Generate a JWT token for the authenticated user
    const token = generateJWT(user);

    // Set the token as a cookie (optional, depending on your strategy)
    setTokenCookie(res, token);

    // Send response back with user data and the token
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      }
    });
  } catch (error) {
    // Pass any error to the global error handler using the formatError utility
    return next(formatError('Server error during authentication', [], 500));
  }
};