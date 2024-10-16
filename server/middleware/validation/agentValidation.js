import { body } from 'express-validator';
import Agent from '../../models/Agent.js';
import mongoose from 'mongoose';  // This is necessary for ObjectId validation

/**
 * @desc Middleware array that validates the fields for creating an Agent.
 * @returns {Array} An array of validation rules to be applied before handling agent creation requests.
 */
export const validateAgentFields = [
  // First name validation
  body('firstName')
    .notEmpty().withMessage('First name is required.')
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters.')
    .isAlpha().withMessage('First name must only contain alphabetic characters.'),

  // Last name validation
  body('lastName')
    .notEmpty().withMessage('Last name is required.')
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters.')
    .isAlpha().withMessage('Last name must only contain alphabetic characters.'),

  // Username validation (must be unique)
  body('username')
    .notEmpty().withMessage('Username is required.')
    .isLength({ min: 4, max: 30 }).withMessage('Username must be between 4 and 30 characters long.')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain alphanumeric characters and underscores.')
    .custom(async (value) => {
      const agent = await Agent.findOne({ username: value });
      if (agent) {
        return Promise.reject('Username already exists.');
      }
    }),

  // Email validation (must be unique)
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .custom(async (value) => {
      const agent = await Agent.findOne({ email: value });
      if (agent) {
        return Promise.reject('Email already exists.');
      }
    }),

  // Phone number validation (must be unique, E.164 format)
  body('phoneNumber')
    .notEmpty().withMessage('Phone number is required.')
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please provide a valid phone number.')
    .custom(async (value) => {
      const agent = await Agent.findOne({ phoneNumber: value });
      if (agent) {
        return Promise.reject('Phone number already exists.');
      }
    }),

  // Agency name validation
  body('agency')
    .notEmpty().withMessage('Agency name is required.')
    .isLength({ max: 100 }).withMessage('Agency name cannot exceed 100 characters.'),

  // Bio validation (optional)
  body('bio')
    .optional()
    .isLength({ max: 1000 }).withMessage('Bio cannot exceed 1000 characters.'),

  // License number validation (must be unique)
  body('licenseNumber')
    .notEmpty().withMessage('License number is required.')
    .custom(async (value) => {
      const agent = await Agent.findOne({ licenseNumber: value });
      if (agent) {
        return Promise.reject('License number already exists.');
      }
    }),

  // Profile image URL validation (optional)
  body('profileImage')
    .optional()
    .matches(/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/).withMessage('Please provide a valid image URL.'),

  // Password validation
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must include at least one uppercase letter, one lowercase letter, and one number.'),

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
