/**
 * This file contains middleware functions that validate the fields for updating an admin.
 */

import { body } from 'express-validator';

/**
 * @desc Middleware array that validates the fields for Admin updates (allows partial updates).
 * 
 * @returns {Array} An array of validation rules to be applied before handling admin update requests.
 */
export const validateAdminUpdateFields = [
  body('firstName')
    .optional()
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters.')
    .isAlpha().withMessage('First name must only contain letters.'),

  body('lastName')
    .optional()
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters.')
    .isAlpha().withMessage('Last name must only contain letters.'),

  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email address.'),

  body('phoneNumber')
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please provide a valid phone number in E.164 format (e.g., +1234567890).'),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
    .withMessage('Password must include at least one uppercase letter, one lowercase letter, and one number.'),

  body('role')
    .optional()
    .custom((value, { req }) => {
      if (req.user.role !== 'super-admin') {
        throw new Error('Only super-admin can update role.');
      }
      return true;
    }),

    body('permissions')
    .optional()
    .isArray().withMessage('Permissions must be an array.')
    .custom((permissions, { req }) => {
      const validPermissions = ['manage_users', 'manage_agents', 'view_reports', 'manage_admins'];

      const allValid = permissions.every(permission => validPermissions.includes(permission));

      if (!allValid) {
        throw new Error('Invalid permission. Valid options are: manage_users, manage_agents, view_reports, manage_admins.');
      }

      return true;
    })
    .withMessage('Permissions must only contain valid values: manage_users, manage_agents, view_reports, manage_admins.'),

  body('profileImage')
    .optional()
    .matches(/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/)
    .withMessage('Please provide a valid image URL (jpg, jpeg, png, or webp).')
];
