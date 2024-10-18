import { body } from 'express-validator';
/**
 * @desc Middleware array that validates the fields for Property updates.
 *       Fields are optional but will be validated if present.
 * @returns {Array} An array of validation rules to be applied before handling property requests.
 */
export const validateUpdatePropertyFields = [
  body('title')
    .optional()
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters.'),

  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters.'),

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

  body('propertyType')
    .optional()
    .isIn(['Apartment', 'House', 'Condo', 'Land', 'Villa', 'Office', 'Studio'])
    .withMessage('Property type must be one of: Apartment, House, Condo, Land, Villa, Office, Studio.'),

  body('price')
    .optional()
    .isInt({ min: 0 }).withMessage('Price must be a positive whole number (integer).'),

  body('status')
    .optional()
    .isIn(['Available', 'Sold', 'Rented', 'Pending'])
    .withMessage('Status must be one of: Available, Sold, Rented, Pending.'),

  body('size')
    .optional()
    .isFloat({ min: 0 }).withMessage('Size must be a positive number.'),

  body('bedrooms')
    .optional()
    .isInt({ min: 1 }).withMessage('Bedrooms must be at least 1.'),

  body('bathrooms')
    .optional()
    .isInt({ min: 1 }).withMessage('Bathrooms must be at least 1.'),

  body('rooms')
    .optional()
    .isInt({ min: 1 }).withMessage('Rooms must be at least 1.'),

  body('offerType')
    .optional()
    .isIn(['Sale', 'Rent'])
    .withMessage('Offer type must be either Sale or Rent.'),

  body('yearBuilt')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage(`Year built must be between 1800 and ${new Date().getFullYear()}.`),

  body('availableFrom')
    .optional()
    .isISO8601().withMessage('Available date must be a valid ISO 8601 date.'),

  body('address.street')
    .optional()
    .isLength({ max: 100 }).withMessage('Street address cannot exceed 100 characters.'),

  body('address.city')
    .optional()
    .notEmpty().withMessage('City is required.'),

  body('address.state')
    .optional()
    .notEmpty().withMessage('State is required.'),

  body('address.zipCode')
    .optional()
    .matches(/^\d{5}(-\d{4})?$/).withMessage('Please provide a valid zip code.'),

  body('address.country')
    .optional()
    .isString().withMessage('Country must be a valid string.'),

  body('images.*')
    .optional()
    .isURL().withMessage('Each image must be a valid URL (jpg, jpeg, png, or webp).')
    .matches(/\.(jpg|jpeg|png|webp)$/).withMessage('Image must be a valid format: jpg, jpeg, png, or webp.'),

  body('amenities')
    .optional()
    .isArray().withMessage('Amenities must be an array of strings.')
    .custom((amenities) => {
      return amenities.every(amenity => typeof amenity === 'string');
    }).withMessage('All amenities must be valid strings.'),

  body('isFeatured')
    .optional()
    .isBoolean().withMessage('isFeatured must be a boolean value.'),

  body('coordinates.lat')
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90 degrees.'),

  body('coordinates.lng')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180 degrees.')
];
