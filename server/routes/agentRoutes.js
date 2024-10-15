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
import checkEmptyBody from '../middleware/common/checkEmptyBody.js';
import checkRequiredFields from '../middleware/common/checkRequiredFields.js'; 
import { checkIsAdmin, checkIsAdminSelfOrAgent} from '../middleware/auth/roleMiddleware.js';  // Role-based access control
import { validateAgentFields } from '../middleware/validation/agentValidation.js';  // Input validation for agents
import { validateUpdateAgentFields } from '../middleware/validation/agentUpdateValidation.js';  // Input validation for agents

const router = express.Router();

/**
 * ============================
 * Agent Routes
 * ============================
 */

// Register a new agent (public route)
router.post(
  '/', 
  checkEmptyBody('Request body is empty. Please provide agent data.'),
  checkRequiredFields({ 
    body: ['firstName', 'lastName', 'username', 'email', 'phoneNumber', 'agency', 'password', 'licenseNumber'] 
  }),  
  validateAgentFields,
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
router.get('/:id', getAgentById);

// Admin-only route to approve or reject agents
router.patch('/:id/status', 
  authenticateJWT, 
  checkIsAdmin, 
  checkRequiredFields({ body: ['agentStatus'] }),
  updateAgentStatus
);

// Update agent information (admin or the agent themselves)
router.put('/:id', authenticateJWT, checkIsAdminSelfOrAgent, validateUpdateAgentFields, updateAgent);

// Delete an agent (admin or the agent themselves)
router.delete('/:id', authenticateJWT, checkIsAdminSelfOrAgent, deleteAgent);


export default router;
