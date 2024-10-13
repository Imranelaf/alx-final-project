import User from '../../models/User.js';
import { generateJWT, setTokenCookie } from '../../utils/authHelpers.js';
import { validationResult } from 'express-validator';

export const signupUser = async (req, res, next) => {
  // Extract validation errors
  const validationErrors = validationResult(req);
  let errors = [];

  // Collect validation errors
  if (!validationErrors.isEmpty()) {
    errors = validationErrors.array().map(err => ({
      field: err.param,
      message: err.msg,
    }));
  }

  const { firstName, lastName, username, email, password } = req.body;

  try {
    // Check if email or username already exists in the database
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      if (existingUser.email === email) {
        errors.push({ field: 'email', message: 'Email is already registered.' });
      }
      if (existingUser.username === username) {
        errors.push({ field: 'username', message: 'Username is already taken.' });
      }
    }

    // Step 4: If there are any errors (validation or business logic), pass them to the global error handler
    if (errors.length > 0) {
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.errors = errors;
      return next(error);  // Forward errors to the global error handler
    }

    // Step 5: Proceed with creating the new user if no errors
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
    // Step 6: Catch any server errors and pass them to the global error handler
    return next(error);
  }
};

export const authenticateUser = async (req, res, next) => {
  try {
    // Passport.js attaches the authenticated user to req.user
    const user = req.user; 

    if (!user) {
      const error = new Error('Authentication failed. No user found.');
      error.statusCode = 401;
      return next(error);
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
    // Pass any server error to the global error handler
    error.statusCode = 500;
    error.message = 'Server error during authentication';
    return next(error);
  }
};
