import { body } from 'express-validator';
import mongoose from 'mongoose';
import Agent from '../../models/Agent.js';

/**
 * @desc Middleware array that validates the fields for Agent updates.
 *       Fields are optional but will be validated if present.
 * @returns {Array} An array of validation rules to be applied before handling agent requests.
 */
export const validateUpdateAgentFields = [
  // First name validation
  body('firstName')
    .optional()
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters.')
    .isAlpha().withMessage('First name must only contain alphabetic characters.'),

  // Last name validation
  body('lastName')
    .optional()
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters.')
    .isAlpha().withMessage('Last name must only contain alphabetic characters.'),

  // Username validation (must be unique)
  body('username')
    .optional()
    .isLength({ min: 4, max: 30 }).withMessage('Username must be between 4 and 30 characters long.')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain alphanumeric characters and underscores.')
    .custom(async (value, { req }) => {
      const agent = await Agent.findOne({ username: value, _id: { $ne: req.params.id } });
      if (agent) {
        return Promise.reject('Username already exists.');
      }
    }),

  // Email validation (must be unique)
  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email address.')
    .custom(async (value, { req }) => {
      const agent = await Agent.findOne({ email: value, _id: { $ne: req.params.id } });
      if (agent) {
        return Promise.reject('Email already exists.');
      }
    }),

  // Phone number validation (must be unique, E.164 format)
  body('phoneNumber')
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please provide a valid phone number.')
    .custom(async (value, { req }) => {
      const agent = await Agent.findOne({ phoneNumber: value, _id: { $ne: req.params.id } });
      if (agent) {
        return Promise.reject('Phone number already exists.');
      }
    }),

  // Agency name validation
  body('agency')
    .optional()
    .isLength({ max: 100 }).withMessage('Agency name cannot exceed 100 characters.'),

  // Bio validation (optional)
  body('bio')
    .optional()
    .isLength({ max: 1000 }).withMessage('Bio cannot exceed 1000 characters.'),

  // License number validation (must be unique)
  body('licenseNumber')
    .optional()
    .custom(async (value, { req }) => {
      const agent = await Agent.findOne({ licenseNumber: value, _id: { $ne: req.params.id } });
      if (agent) {
        return Promise.reject('License number already exists.');
      }
    }),

  // Profile image URL validation (optional)
  body('profileImage')
    .optional()
    .matches(/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/).withMessage('Please provide a valid image URL.'),

  // Password validation (optional)
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must include at least one uppercase letter, one lowercase letter, and one number.'),

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

  // Social media links validation (optional)
  body('socialMediaLinks.facebook')
    .optional()
    .matches(/^https?:\/\/(www\.)?facebook.com\/.+$/).withMessage('Please provide a valid Facebook URL.'),

  body('socialMediaLinks.linkedin')
    .optional()
    .matches(/^https?:\/\/(www\.)?linkedin.com\/.+$/).withMessage('Please provide a valid LinkedIn URL.'),

  body('socialMediaLinks.twitter')
    .optional()
    .matches(/^https?:\/\/(www\.)?twitter.com\/.+$/).withMessage('Please provide a valid Twitter URL.'),

  // Availability validation (optional)
  body('availability')
    .optional()
    .isBoolean().withMessage('Availability must be true or false.'),
];
