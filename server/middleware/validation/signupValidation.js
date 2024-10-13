import { body } from 'express-validator';

// Validation for firstName
export const validateSignUpFields = [
  body('firstName')
    .notEmpty().withMessage('First name is required.')
    .isLength({ min: 2 }).withMessage('First name must be at least 2 characters long.')
    .isAlpha().withMessage('First name can only contain letters.')
    .custom((value) => {
      if (['admin', 'administrator'].includes(value.trim().toLowerCase())) {
        throw new Error('The first name you entered is not allowed. Please choose a different one.');
      }
      return true;
    }),

  // Validation for lastName
  body('lastName')
    .notEmpty().withMessage('Last name is required.')
    .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long.')
    .isAlpha().withMessage('Last name can only contain letters.')
    .custom((value) => {
      if (['admin', 'administrator'].includes(value.trim().toLowerCase())) {
        throw new Error('The last name you entered is not allowed. Please choose a different one.');
      }
      return true;
    }),

  // Validation for username
  body('username')
    .notEmpty().withMessage('Username is required.')
    .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters long.')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores.')
    .custom((value) => {
      if (['admin', 'administrator'].includes(value.trim().toLowerCase())) {
        throw new Error('The username you entered is not allowed. Please choose a different one.');
      }
      return true;
    }),

  // Validation for email
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).withMessage('Please enter a valid email format.'),

  // Validation for password
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
    .withMessage('Password must include at least one uppercase letter, one lowercase letter, and one number.')
];
