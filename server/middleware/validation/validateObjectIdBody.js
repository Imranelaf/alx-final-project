import { body } from 'express-validator';

export const validatePropertyIdBody = [
  body('propertyId')
    .notEmpty().withMessage('Property ID is required.')
    .isMongoId().withMessage('Property ID must be a valid MongoDB ObjectId.'),
];
