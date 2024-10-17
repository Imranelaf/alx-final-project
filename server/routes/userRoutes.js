/**
 * This file contains the routes for user management in the system.
 */

import express from 'express';

// Controllers
import {
  getUsersByFilter,
  getUserById,
  updateUser,
  deleteUser,
  addPropertyToUser,
  removePropertyFromUser,
} from '../controllers/user/userController.js';

// Middleware - Authentication & Authorization
import authenticateJWT from '../middleware/auth/authMiddleware.js';
import { checkIsUserSelfOrAdmin } from '../middleware/auth/roleMiddleware.js';  // Role-based access control

// Middleware - Validation
import { validateObjectId } from '../middleware/validation/validateObjectId.js';
import { validateUpdateUserFields } from '../middleware/validation/userUpdateValidation.js';
import { validatePropertyIdBody } from '../middleware/validation/validateObjectIdBody.js';
import { handleValidationErrors } from '../middleware/common/handleValidationErrors.js';
import { validateUserObjectIdParam } from '../middleware/validation/validateUserObjectId.js';

const router = express.Router();

// Get Users by filter (public)
router.get(
  '/', 
  getUsersByFilter
);

// Get a specific users by ID (public)
router.get(
  '/:id',
  validateObjectId, 
  getUserById
);

// Update user information (admin or the user themselves)
router.put(
  '/:id', 
  authenticateJWT,
  validateObjectId, 
  checkIsUserSelfOrAdmin, 
  validateUpdateUserFields, 
  updateUser
);

// Delete a user (admin or the user themselves)
router.delete(
  '/:id', 
  authenticateJWT,
  validateObjectId, 
  checkIsUserSelfOrAdmin, 
  deleteUser
);

router.post(
  '/:userId/add-property',
  authenticateJWT,
  checkIsUserSelfOrAdmin, 
  validateUserObjectIdParam,
  validatePropertyIdBody,
  handleValidationErrors,
  addPropertyToUser,
);

router.put(
  '/:userId/remove-property',
  authenticateJWT,
  checkIsUserSelfOrAdmin, 
  validateUserObjectIdParam,
  validatePropertyIdBody,
  handleValidationErrors,
  removePropertyFromUser
);


export default router;