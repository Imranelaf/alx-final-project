/**
 * This file contains a middleware function to validate the user object ID.
 */

import { isValidObjectId } from 'mongoose';
import { ValidationError } from '../../utils/customErrors.js';

export const validateUserObjectIdParam = (req, res, next) => {
  const { userId } = req.params;  // Make sure to reference the correct param (userId)
  if (!isValidObjectId(userId)) {
    return next(new ValidationError('Invalid User ID'));  // Customize the error message
  }
  next();
};
