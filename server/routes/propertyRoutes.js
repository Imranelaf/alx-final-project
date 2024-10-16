import express from 'express';
import {
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getPropertiesByFilter
} from '../controllers/property/propertiesController.js';
import { validateObjectId } from '../middleware/validation/validateObjectId.js';
import authenticateJWT from '../middleware/auth/authMiddleware.js';
import { validatePropertyFields } from '../middleware/validation/propertyValidation.js';
import { validateUpdatePropertyFields } from '../middleware/validation/propertyUpdateValidation.js';
import { validateFilterQuery } from '../middleware/validation/propertyQueryValidation.js';
import { 
  checkRoleToCreateProperty,
  checkIsAdminOrOwnerOrAgent
 } from '../middleware/auth/roleMiddleware.js';  // Role-based access control
import { handleValidationErrors } from '../middleware/common/handleValidationErrors.js'; // Make sure this is imported correctly

const router = express.Router();

/**
 * ============================
 * Property Routes
 * ============================
 */

// Create a new property (authenticated users only)
router.post(
  '/', 
  authenticateJWT,
  checkRoleToCreateProperty, 
  validatePropertyFields,
  handleValidationErrors,   
  createProperty
);

// Get a specific property by ID (public)
router.get(
  '/:id',
  validateObjectId, 
  getPropertyById
);



// Update property information (admin, agent or the property owner)
router.put(
  '/:id', 
  authenticateJWT, 
  validateObjectId, 
  checkIsAdminOrOwnerOrAgent,
  validateUpdatePropertyFields,
  handleValidationErrors,
  updateProperty
);

// Delete a property (admin or the property owner)
router.delete(
  '/:id', 
  authenticateJWT, 
  validateObjectId, 
  checkIsAdminOrOwnerOrAgent, 
  deleteProperty
);

// Route for fetching properties (all or filtered)
router.get(
  '/', 
  validateFilterQuery,  // Optional: Validates the filters provided
  handleValidationErrors, 
  getPropertiesByFilter  // Fetch properties based on filters or return all properties
);

export default router;
