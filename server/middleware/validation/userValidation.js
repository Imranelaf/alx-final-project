/**
 * This file contains validation middleware functions for the user routes.
 */

import { body } from 'express-validator';


export const validateUserFields = [
  body('firstName')
    .notEmpty().withMessage('First name is required.')
    .isLength({ min: 2, max: 30 }).withMessage('First name must be between 2 and 30 characters long.')
    .matches(/^[a-zA-Z]+$/).withMessage('First name can only contain letters.'),

  body('lastName')
    .notEmpty().withMessage('Last name is required.')
    .isLength({ min: 2, max: 30 }).withMessage('Last name must be between 2 and 30 characters long.')
    .matches(/^[a-zA-Z]+$/).withMessage('Last name can only contain letters.'),

  body('username')
    .notEmpty().withMessage('Username is required.')
    .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters long.')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores.'),

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

  body('role')
  .optional()
  .isIn(['user']).withMessage('Role must be: user'),

  body('isEmailVerified')
    .optional()
    .isBoolean().withMessage('Email verification status must be a boolean value (true or false).'),

  body('lastLogin')
    .optional()
    .isISO8601().withMessage('Last login must be a valid date.'),

  body('failedLoginAttempts')
    .optional()
    .isInt({ min: 0 }).withMessage('Failed login attempts must be a positive integer.'),

  body('lockUntil')
    .optional()
    .isISO8601().withMessage('Lock until must be a valid date.'),
  
  body('avatar')
    .optional()
    .isURL().withMessage('Avatar must be a valid URL.')
];
