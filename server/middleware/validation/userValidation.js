import { body } from 'express-validator';
import {accountStatusEnum } from '../../models/User.js'; // Importing enums for validation

export const validateUserFields = [
  // Validate first name
  body('firstName')
    .notEmpty().withMessage('First name is required.')
    .isLength({ min: 2, max: 30 }).withMessage('First name must be between 2 and 30 characters long.')
    .matches(/^[a-zA-Z]+$/).withMessage('First name can only contain letters.'),

  // Validate last name
  body('lastName')
    .notEmpty().withMessage('Last name is required.')
    .isLength({ min: 2, max: 30 }).withMessage('Last name must be between 2 and 30 characters long.')
    .matches(/^[a-zA-Z]+$/).withMessage('Last name can only contain letters.'),

  // Validate username
  body('username')
    .notEmpty().withMessage('Username is required.')
    .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters long.')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores.'),

  // Validate email
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(), // Normalize email address to lowercase

  // Validate password
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
    .withMessage('Password must include at least one uppercase letter, one lowercase letter, and one number.'),

  // Validate role (optional, default role will be 'user')
  body('role')
  .optional()
  .isIn(['user']).withMessage('Role must be: user'),

  // Validate account status (optional, default is 'active')
  body('accountStatus')
    .optional()
    .isIn(accountStatusEnum).withMessage(`Account status must be one of: ${accountStatusEnum.join(', ')}`),

  // Ensure isEmailVerified is a boolean (optional)
  body('isEmailVerified')
    .optional()
    .isBoolean().withMessage('Email verification status must be a boolean value (true or false).'),

  // Ensure lastLogin is a valid date (optional)
  body('lastLogin')
    .optional()
    .isISO8601().withMessage('Last login must be a valid date.'),

  // Validate failedLoginAttempts (optional, should be an integer)
  body('failedLoginAttempts')
    .optional()
    .isInt({ min: 0 }).withMessage('Failed login attempts must be a positive integer.'),

  // Validate lockUntil (optional, should be a valid date)
  body('lockUntil')
    .optional()
    .isISO8601().withMessage('Lock until must be a valid date.'),
  
  // Validate avatar (optional)
  body('avatar')
    .optional()
    .isURL().withMessage('Avatar must be a valid URL.')
];
