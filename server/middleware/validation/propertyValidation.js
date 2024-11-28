/**
 * This file contains validation middleware functions for the property routes.
 */

import { body } from 'express-validator';

export const validatePropertyFields = [
  body('title')
    .notEmpty().withMessage('Property title is required.')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters.'),

  body('description')
    .notEmpty().withMessage('Description is required.')
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters.'),

  body('phoneNumber')
  .notEmpty().withMessage('Phone number is required.'),

  body('propertyType')
    .notEmpty().withMessage('Property type is required.')
    .isIn(['Apartment', 'House', 'Villa', 'Office', 'Studio'])
    .withMessage('Property type must be one of: Apartment, House, Villa, Office or Studio.'),

  body('price')
    .notEmpty().withMessage('Price is required.')
    .isInt({ min: 0 }).withMessage('Price must be a positive whole number (integer).'),

  body('status')
    .optional()
    .isIn(['Available', 'Sold', 'Rented', 'Pending'])
    .withMessage('Status must be one of: Available, Sold, Rented, Pending.'),

  body('bedrooms')
    .notEmpty().withMessage('Number of bedrooms is required.')
    .isInt({ min: 1 }).withMessage('Bedrooms must be at least 1.'),

  body('bathrooms')
    .notEmpty().withMessage('Number of bathrooms is required.')
    .isInt({ min: 1 }).withMessage('Bathrooms must be at least 1.'),

  body('rooms')
    .notEmpty().withMessage('Number of rooms is required.')
    .isInt({ min: 1 }).withMessage('Rooms must be at least 1.'),

  body('offerType')
    .notEmpty().withMessage('Offer type is required.')
    .isIn(['Sale', 'Rent'])
    .withMessage('Offer type must be either Sale or Rent.'),

  body('availableFrom')
    .optional()
    .isISO8601().withMessage('Available date must be a valid ISO 8601 date.'),

  body('address.street')
    .notEmpty().withMessage('Street address is required.')
    .isLength({ max: 100 }).withMessage('Street address cannot exceed 100 characters.'),

  body('address.city')
    .notEmpty().withMessage('City is required.'),

  body('address.country')
    .optional().default('Morocco')
    .isString().withMessage('Country must be a valid string.'),

  body('images.*')
    .optional()
    .isURL().withMessage('Each image must be a valid URL (jpg, jpeg, png, or webp).')
    .matches(/\.(jpg|jpeg|png|webp)$/).withMessage('Image must be a valid format: jpg, jpeg, png, or webp.'),

];
