/**
 * This file contains middleware functions that validate the fields for creating a new Admin.
 */

import { body } from 'express-validator';

/**
 * @desc Middleware array that validates the fields for creating a new Admin.
 * @returns {Array} An array of validation rules to be applied before handling admin creation requests.
 */
export const validateAdminFields = [
  body('firstName')
    .notEmpty().withMessage('First name is required.')
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters.')
    .isAlpha().withMessage('First name must only contain alphabetic characters.'),

  body('lastName')
    .notEmpty().withMessage('Last name is required.')
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters.')
    .isAlpha().withMessage('Last name must only contain alphabetic characters.'),

  body('username')
    .notEmpty().withMessage('Username is required.')
    .isLength({ min: 4, max: 30 }).withMessage('Username must be between 4 and 30 characters long.')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain alphanumeric characters and underscores.'),

  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.'),

  body('phoneNumber')
    .notEmpty().withMessage('Phone number is required.')
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please provide a valid phone number in E.164 format (e.g., +1234567890).'),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must include at least one uppercase letter, one lowercase letter, and one number.'),

  body('role')
    .optional()
    .isIn(['admin', 'super-admin']).withMessage('Role must be either "admin" or "super-admin".'),

  body('permissions')
    .optional()
    .isArray().withMessage('Permissions must be an array.')
    .custom((permissions) => {
      const validPermissions = ['manage_users', 'manage_agents', 'view_reports', 'manage_admins'];
      for (const permission of permissions) {
        if (!validPermissions.includes(permission)) {
          throw new Error(`Invalid permission: ${permission}.`);
        }
      }
      return true;
    }),

  body('profileImage')
    .optional()
    .matches(/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/).withMessage('Please provide a valid image URL (jpg, jpeg, png, or webp).')
];
