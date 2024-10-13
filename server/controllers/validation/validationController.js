import User from '../../models/User.js';

// Controller to check if a username is available
export const checkUsername = async (req, res, next) => {
  const { username } = req.params; // Get the username from the request parameters

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      const error = new Error('Username is already taken.');
      error.statusCode = 400;
      error.errors = [{ field: 'username', message: 'This username is unavailable.' }];
      return next(error);  // handleValidationErros handler will catch and format this
    }

    // If username is available, return success
    return res.status(200).json({ success: true, message: 'Username is available.' });
  } catch (error) {
    console.error('Error checking username availability:', error);
    return next(error); // Pass any unexpected errors to the handleValidationErros handler
  }
};


// Controller to check if an email is already registered
export const checkEmail = async (req, res, next) => {
  const { email } = req.params;  // Get the email from the request parameters

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error('Email is already taken.');
      error.statusCode = 400;
      error.errors = [{ field: 'email', message: 'This email is already taken.' }];
      return next(error);  // handleValidationErros handler will catch and format this
    }

    // If email is available, return success
    return res.status(200).json({ success: true, message: 'Email is available.' });
  } catch (error) {
    console.error('Error checking email availability:', error);
    return next(error); // Pass any unexpected errors to the handleValidationErros handler
  }
};
