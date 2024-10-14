/*
Middleware for validating admin-related fields using express-validator. 
This validation ensures that the data submitted for creating or updating admins meets the
required format and constraints.
*/

import { body } from 'express-validator';

/**
 * @desc   Middleware array that validates the fields for creating a new admin. 
 * 
 * @returns {Array} An array of validation rules to be applied before handling admin requests.
 */
export const validateAdminFields = [
  // First name validation
  body('firstName')
    .notEmpty().withMessage('First name is required.')
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters.')
    .isAlpha().withMessage('First name must only contain letters.'),

  // Last name validation
  body('lastName')
    .notEmpty().withMessage('Last name is required.')
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters.')
    .isAlpha().withMessage('Last name must only contain letters.'),

  // Email validation
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.'),

  // Phone number validation (E.164 format)
  body('phoneNumber')
    .notEmpty().withMessage('Phone number is required.')
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please provide a valid phone number in E.164 format (e.g., +1234567890).'),

  // Password validation
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
    .withMessage('Password must include at least one uppercase letter, one lowercase letter, and one number.'),

  // Role validation
  body('role')
    .optional()
    .isIn(['admin', 'super-admin']).withMessage('Role must be either "admin" or "super-admin".'),

  // Permissions validation (optional but must be a valid array of strings if provided)
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
    }).withMessage('Permissions must only contain valid values: manage_users, manage_agents, view_reports, manage_admins.'),

  // Profile image URL validation (optional but must be valid URL if provided)
  body('profileImage')
    .optional()
    .matches(/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/)
    .withMessage('Please provide a valid image URL (jpg, jpeg, png, or webp).')
];
