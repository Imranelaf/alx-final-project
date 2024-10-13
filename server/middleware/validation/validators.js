import { body, param } from 'express-validator';

// Reusable validation for firstName
export const firstNameValidator = () =>
  body('firstName')
    .notEmpty().withMessage('First name is required.')
    .isLength({ min: 2 }).withMessage('First name must be at least 2 characters long.')
    .isAlpha().withMessage('First name can only contain letters.')
    .custom((value) => {
      if (['admin', 'administrator'].includes(value.trim().toLowerCase())) {
        throw new Error('The first name you entered is not allowed. Please choose a different one.');
      }
      return true;
    });

// Reusable validation for lastName
export const lastNameValidator = () =>
  body('lastName')
    .notEmpty().withMessage('Last name is required.')
    .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long.')
    .isAlpha().withMessage('Last name can only contain letters.')
    .custom((value) => {
      if (['admin', 'administrator'].includes(value.trim().toLowerCase())) {
        throw new Error('The last name you entered is not allowed. Please choose a different one.');
      }
      return true;
    });

// Reusable validation for username (works with either param or body)
// location specifies where the input is coming from eithe param or body
export const usernameValidator = (location = 'username') => [
  (location === 'param' ? param('username') : body('username'))
    .notEmpty().withMessage('Username is required.')
    .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters long.')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores.')
    .custom((value) => {
      if (['admin', 'administrator'].includes(value.trim().toLowerCase())) {
        throw new Error('The username you entered is not allowed. Please choose a different one.');
      }
      return true;
    })
];

// Reusable validation for email (works with either param or body)
// location specifies where the input is coming from eithe param or body
export const emailValidator = (location = 'email') => [
  (location === 'param' ? param('email') : body('email'))
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).withMessage('Please enter a valid email format.')
];

// Reusable validation for password
export const passwordValidator = () =>
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
    .withMessage('Password must include at least one uppercase letter, one lowercase letter, and one number.');
