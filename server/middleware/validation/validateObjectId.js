import { isValidObjectId } from 'mongoose';
import { ValidationError } from '../../utils/customErrors.js';

export const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new ValidationError('Invalid ID'));
  }
  next();
};
