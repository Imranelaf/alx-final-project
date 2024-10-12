import User from '../../models/User.js';
import { formatError } from '../../utils/errorFormatter.js';  // Import the formatError utility

// Controller to check if a username is available
export const checkUsername = async (req, res, next) => {
  const { username } = req.params; // Get the username from the request parameters

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      // Username is taken, return a formatted error
      return next(formatError('Username is already taken.', [{ field: 'username', message: 'This username is unavailable.' }], 400));
    }

    // If username is available, return success
    return res.status(200).json({ success: true, message: 'Username is available.' });
  } catch (error) {
    console.error('Error checking username availability:', error);
    // Pass server error to global error handler
    return next(formatError('Server error during username check.', [], 500));
  }
};

// Controller to check if an email is already registered
export const checkEmail = async (req, res, next) => {
  const { email } = req.params;  // Get the email from the request parameters

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Email is registered, return a formatted error
      return next(formatError('Email is already registered.', [{ field: 'email', message: 'This email is already registered.' }], 400));
    }

    // If email is available, return success
    return res.status(200).json({ success: true, message: 'Email is available.' });
  } catch (error) {
    console.error('Error checking email availability:', error);
    // Pass server error to global error handler
    return next(formatError('Server error during email check.', [], 500));
  }
};
