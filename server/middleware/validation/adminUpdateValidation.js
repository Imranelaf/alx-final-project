import { body } from 'express-validator';

/**
 * @desc Middleware array that validates the fields for Admin updates (allows partial updates).
 * 
 * @returns {Array} An array of validation rules to be applied before handling admin update requests.
 */
export const validateAdminFields = [
  // First name validation (optional for update)
  body('firstName')
    .optional()
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters.')
    .isAlpha().withMessage('First name must only contain letters.'),

  // Last name validation (optional for update)
  body('lastName')
    .optional()
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters.')
    .isAlpha().withMessage('Last name must only contain letters.'),

  // Email validation (optional for update)
  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email address.'),

  // Phone number validation (optional for update)
  body('phoneNumber')
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please provide a valid phone number in E.164 format (e.g., +1234567890).'),

  // Password validation (optional for update)
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
    .withMessage('Password must include at least one uppercase letter, one lowercase letter, and one number.'),

  // Role validation should not be allowed unless you're a super admin
  body('role')
    .optional()
    .custom((value, { req }) => {
      if (req.user.role !== 'super-admin') {
        throw new Error('Only super-admin can update role.');
      }
      return true;
    }),

  // Permissions validation (optional, must be an array of strings if provided)
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

  // Profile image URL validation (optional)
  body('profileImage')
    .optional()
    .matches(/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/)
    .withMessage('Please provide a valid image URL (jpg, jpeg, png, or webp).')
];
