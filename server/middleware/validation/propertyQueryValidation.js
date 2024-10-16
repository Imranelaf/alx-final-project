import { query } from 'express-validator';

/**
 * @desc Middleware array that validates the query parameters for filtering properties.
 *       Filters are optional but will be validated if present.
 * @returns {Array} An array of validation rules to be applied before handling property filter requests.
 */
export const validateFilterQuery = [
  query('title')
    .optional()
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters.'),

  query('propertyType')
    .optional()
    .isIn(['Apartment', 'House', 'Condo', 'Land', 'Villa', 'Office', 'Studio'])
    .withMessage('Property type must be one of: Apartment, House, Condo, Land, Villa, Office, Studio.'),

  query('priceMin')
    .optional()
    .isInt({ min: 0 }).withMessage('Minimum price must be a positive whole number (integer).'),

  query('priceMax')
    .optional()
    .isInt({ min: 0 }).withMessage('Maximum price must be a positive whole number (integer).'),

  query('status')
    .optional()
    .isIn(['Available', 'Sold', 'Rented', 'Pending'])
    .withMessage('Status must be one of: Available, Sold, Rented, Pending.'),

  query('sizeMin')
    .optional()
    .isFloat({ min: 0 }).withMessage('Minimum size must be a positive number.'),

  query('sizeMax')
    .optional()
    .isFloat({ min: 0 }).withMessage('Maximum size must be a positive number.'),

  query('bedrooms')
    .optional()
    .isInt({ min: 1 }).withMessage('Bedrooms must be at least 1.'),

  query('bathrooms')
    .optional()
    .isInt({ min: 1 }).withMessage('Bathrooms must be at least 1.'),

  query('offerType')
    .optional()
    .isIn(['Sale', 'Rent'])
    .withMessage('Offer type must be either Sale or Rent.'),

  query('yearBuiltMin')
    .optional()
    .isInt({ min: 1800 }).withMessage('Minimum year built must be after 1800.'),

  query('yearBuiltMax')
    .optional()
    .isInt({ max: new Date().getFullYear() })
    .withMessage(`Maximum year built must be before ${new Date().getFullYear()}.`),

  query('availableFrom')
    .optional()
    .isISO8601().withMessage('Available date must be a valid ISO 8601 date.'),

  query('address.city')
    .optional()
    .isString().withMessage('City must be a valid string.'),

  query('address.state')
    .optional()
    .isString().withMessage('State must be a valid string.'),

  query('address.zipCode')
    .optional()
    .matches(/^\d{5}(-\d{4})?$/).withMessage('Please provide a valid zip code.'),

  query('coordinates.lat')
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90 degrees.'),

  query('coordinates.lng')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180 degrees.')
];
