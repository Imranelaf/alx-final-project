import { body } from 'express-validator';

export const validatePropertyFields = [
  body('title')
    .notEmpty().withMessage('Title is required.')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters.'),

  // Description: required and max length 500 characters
  body('description')
    .notEmpty().withMessage('Description is required.')
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters.'),

  // Property Type: required and must be one of the predefined types
  body('propertyType')
    .notEmpty().withMessage('Property type is required.')
    .isIn(['Apartment', 'House', 'Condo', 'Land', 'Villa', 'Office', 'Studio'])
    .withMessage('Invalid property type. Must be one of: Apartment, House, Condo, Land, Villa, Office, Studio.'),

  // Price: required and must be a positive number
  body('price')
    .notEmpty().withMessage('Price is required.')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number.'),

  // Status: optional, but if present must be one of the allowed statuses
  body('status')
    .optional()
    .isIn(['Available', 'Sold', 'Rented', 'Pending'])
    .withMessage('Invalid status. Must be one of: Available, Sold, Rented, Pending.'),

  // Size: required and must be a positive number
  body('size')
    .notEmpty().withMessage('Size is required.')
    .isFloat({ min: 0 }).withMessage('Size must be a positive number.'),

  // Bedrooms: required and must be a positive integer
  body('bedrooms')
    .notEmpty().withMessage('Number of bedrooms is required.')
    .isInt({ min: 1 }).withMessage('Bedrooms must be at least 1.'),

  // Bathrooms: required and must be a positive integer
  body('bathrooms')
    .notEmpty().withMessage('Number of bathrooms is required.')
    .isInt({ min: 1 }).withMessage('Bathrooms must be at least 1.'),

  // Rooms: required and must be a positive integer
  body('rooms')
    .notEmpty().withMessage('Number of rooms is required.')
    .isInt({ min: 1 }).withMessage('Rooms must be at least 1.'),

  // Offer Type: required and must be either 'Sale' or 'Rent'
  body('offerType')
    .notEmpty().withMessage('Offer type is required.')
    .isIn(['Sale', 'Rent']).withMessage('Offer type must be either Sale or Rent.'),

  // Coordinates: Latitude and Longitude must be valid numbers
  body('coordinates.lat')
    .notEmpty().withMessage('Latitude is required.')
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90.'),
  body('coordinates.lng')
    .notEmpty().withMessage('Longitude is required.')
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180.'),

  // Address: street, city, state, zipCode are required
  body('address.street')
    .notEmpty().withMessage('Street address is required.')
    .isLength({ max: 100 }).withMessage('Street address cannot exceed 100 characters.'),
  body('address.city')
    .notEmpty().withMessage('City is required.'),
  body('address.state')
    .notEmpty().withMessage('State is required.'),
  body('address.zipCode')
    .notEmpty().withMessage('Zip code is required.')
    .matches(/^\d{5}(-\d{4})?$/).withMessage('Please provide a valid zip code.'),

  // Images: Optional but must be valid URLs if provided
  body('images')
    .optional()
    .isArray().withMessage('Images must be an array of URLs.')
    .custom((images) => {
      for (let url of images) {
        if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/.test(url)) {
          throw new Error('Invalid image URL. Must be a valid URL pointing to a jpg, jpeg, png, or webp file.');
        }
      }
      return true;
    }),

  // Optional: Year built, but if present, it must be between 1800 and the current year
  body('yearBuilt')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage(`Year built must be between 1800 and ${new Date().getFullYear()}.`),
];
