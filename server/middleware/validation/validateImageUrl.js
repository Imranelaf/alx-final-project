/**
 * This file contains validation middleware functions for the image URL routes.
 */

import { body } from 'express-validator';

export const validateImageUrl = [
  body('imageUrl')
    .notEmpty().withMessage('Image URL is required.')
    .isURL().withMessage('Image must be a valid URL.')
    .matches(/\.(jpg|jpeg|png|webp)$/).withMessage('Image must be a valid format: jpg, jpeg, png, or webp.'),
];
