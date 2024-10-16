
import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/user/userController.js';
import {validateObjectId} from '../middleware/validation/validateObjectId.js';
import authenticateJWT from '../middleware/auth/authMiddleware.js';

import { 
  checkIsUserSelfOrAdmin
} from '../middleware/auth/roleMiddleware.js';  // Role-based access control
import { validateUpdateUserFields } from '../middleware/validation/userUpdateValidation.js';  // Input validation for users


const router = express.Router();

/**
 * ============================
 * User Routes
 * ============================
 */

// Get all users (public)
router.get(
  '/', 
  getAllUsers
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

// Delete an user (admin or the user themselves)
router.delete(
  '/:id', 
  authenticateJWT,
  validateObjectId, 
  checkIsUserSelfOrAdmin, 
  deleteUser
);

export default router;

