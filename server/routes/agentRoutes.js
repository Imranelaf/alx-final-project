/**
 * This file contains the routes for agent management in the system.
 */

import express from 'express';
import {
  createAgent,
  loginAgent,
  getAllAgents,
  getAgentById,
  updateAgentStatus,
  updateAgent,
  deleteAgent,
} from '../controllers/agent/agentController.js';
import authenticateJWT from '../middleware/auth/authMiddleware.js';
import { checkIsAdmin, checkIsAdminSelfOrAgent} from '../middleware/auth/roleMiddleware.js';  // Role-based access control
import { validateAgentFields } from '../middleware/validation/agentValidation.js';  // Input validation for agents
import { validateUpdateAgentFields } from '../middleware/validation/agentUpdateValidation.js';  // Input validation for agents
import { handleValidationErrors } from '../middleware/common/handleValidationErrors.js';
import {validateObjectId} from '../middleware/validation/validateObjectId.js';

const router = express.Router();

/**
 * ============================
 * Agent Routes
 * ============================
 */

// Register a new agent (public route)
router.post(
  '/', 
  validateAgentFields,
  handleValidationErrors,  
  createAgent
);

// Agent login route (public)
router.post(
  '/login', 
  loginAgent
);

// Get all agents (public)
router.get('/', getAllAgents);

// Get a specific agent by ID (public)
router.get(
  '/:id',
  validateObjectId, 
  getAgentById);

// Admin-only route to approve or reject agents
router.patch(
  '/:id/status', 
  authenticateJWT,
  validateObjectId,  
  checkIsAdmin, 
  updateAgentStatus
);

// Update agent information (admin or the agent themselves)
router.put(
  '/:id', 
  authenticateJWT,
  validateObjectId, 
  checkIsAdminSelfOrAgent, 
  validateUpdateAgentFields, 
  updateAgent);

// Delete an agent (admin or the agent themselves)
router.delete(
  '/:id', 
  authenticateJWT,
  validateObjectId, 
  checkIsAdminSelfOrAgent, 
  deleteAgent
);


export default router;
