/**
 * This file contains the routes for agent management in the system.
 */

import express from 'express';
import {
  getAllAgents,
  getAgentById,
  updateAgentStatus,
  updateAgent,
  deleteAgent,
} from '../controllers/agent/agentController.js';
import authenticateJWT from '../middleware/auth/authMiddleware.js';
import { checkIsAdmin, checkIsAgentSelfOrAdmin} from '../middleware/auth/roleMiddleware.js';  // Role-based access control
import { validateUpdateAgentFields } from '../middleware/validation/agentUpdateValidation.js';  // Input validation for agents
import {validateObjectId} from '../middleware/validation/validateObjectId.js';


const router = express.Router();

/**
 * ============================
 * Agent Routes
 * ============================
 */

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
  checkIsAgentSelfOrAdmin, 
  validateUpdateAgentFields, 
  updateAgent);

// Delete an agent (admin or the agent themselves)
router.delete(
  '/:id', 
  authenticateJWT,
  validateObjectId, 
  checkIsAgentSelfOrAdmin, 
  deleteAgent
);


export default router;

