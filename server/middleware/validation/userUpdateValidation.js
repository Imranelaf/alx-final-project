/**
 * This file contains validation middleware functions for the user update routes.
 */

import { body } from 'express-validator';
import mongoose from 'mongoose';
import User from '../../models/User.js';

/**
 * @desc Middleware array that validates the fields for User updates.
 *       Fields are optional but will be validated if present.
 * @returns {Array} An array of validation rules to be applied before handling user requests.
 */
export const validateUpdateUserFields = [
  body('firstName')
    .optional()
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters.')
    .isAlpha().withMessage('First name must only contain alphabetic characters.'),

  body('lastName')
    .optional()
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters.')
    .isAlpha().withMessage('Last name must only contain alphabetic characters.'),

  body('username')
    .optional()
    .isLength({ min: 4, max: 30 }).withMessage('Username must be between 4 and 30 characters long.')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain alphanumeric characters and underscores.')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ username: value, _id: { $ne: req.params.id } });
      if (user) {
        return Promise.reject('Username already exists.');
      }
    }),

  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email address.')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value, _id: { $ne: req.params.id } });
      if (user) {
        return Promise.reject('Email already exists.');
      }
    }),

  body('avatar')
    .optional()
    .matches(/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/).withMessage('Please provide a valid image URL.'),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must include at least one uppercase letter, one lowercase letter, and one number.'),

  body('role')
    .optional()
    .isIn(['user']).withMessage('Invalid role. Only "user" is allowed.'),

  body('accountStatus')
    .optional()
    .isIn(['active', 'pending', 'suspended', 'deactivated']).withMessage('Invalid account status.'),

  body('isEmailVerified')
    .optional()
    .isBoolean().withMessage('Email verification status must be true or false.'),

  body('lastLogin')
    .optional()
    .isISO8601().withMessage('Last login must be a valid date.'),

  body('failedLoginAttempts')
    .optional()
    .isInt({ min: 0 }).withMessage('Failed login attempts must be a positive integer.'),

  body('lockUntil')
    .optional()
    .isISO8601().withMessage('Lock until must be a valid date.'),

  // Properties validation (optional)
  body('properties')
  .optional()
  .isArray().withMessage('Properties must be an array of ObjectIds.')
  .custom((value) => {
    if (!value.every(mongoose.Types.ObjectId.isValid)) {
      throw new Error('Invalid property IDs.');
    }
    return true;
  }),

  body('isUsernameCustomized')
    .optional()
    .isBoolean().withMessage('isUsernameCustomized must be a boolean value (true or false).'),
];

