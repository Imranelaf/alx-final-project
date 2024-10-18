/**
 * This file contains validation middleware functions for the amenity routes.
 */

import { body } from 'express-validator';

export const validateAmenity = [
  body('amenity')
    .notEmpty().withMessage('Amenity is required.')
    .isString().withMessage('Amenity must be a valid string.')
];
