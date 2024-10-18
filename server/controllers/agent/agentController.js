/**
 *  This file contains the controller functions for handling agent user operations.
 */

import {excludeSensitiveInfo} from '../../utils/excludeSensitiveInfo.js';
import {
  getAgentsByFilterService, 
  getAgentByIdService,
  deleteAgentService,
  updateAgentService,
  updateAgentStatusService, 
} from '../../services/agentService.js';


/**
 * @desc    Controller to handle retrieving all agent users from the database.
 * @param   {Object} req - Express request object.
 * @param   {Object} res - Express response object used to send the list of agents.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - JSON response with the success status and list of all agents.
 */
export const getAgentsByFilter = async (req, res, next) => {
  try {
    const filters = req.query;  // Extract filters from query parameters

    const agents = await getAgentsByFilterService(filters);

    const sanitizedAgents = agents.map(agent => excludeSensitiveInfo(agent, ['password', '__v']));

    return res.status(200).json({
      success: true,
      data: sanitizedAgents,
    });

  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Get a specific agent by ID from the database.
 *          Returns agent data except for the password field.
 * @route   GET /api/agent/:id
 * @access  Private (Agent/Admin)
 * @param   {Object} req - Express request object containing the agent ID in params.
 * @param   {Object} res - Express response object for sending the agent data.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - Success response with agent data or formatted error.
 */
export const getAgentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const agent = await getAgentByIdService(id);

    const sanitizedAgent = excludeSensitiveInfo(agent, ['password', '__v']);

    return res.status(200).json({
      success: true,
      data: sanitizedAgent,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Controller to delete an agent by ID.
 * @route   DELETE /api/agent/:id
 * @access  Private (Admin)
 * @param   {Object} req - Express request object containing the agent ID in the params.
 * @param   {Object} res - Express response object used to send the deletion result.
 * @param   {Function} next - Express middleware function for error handling.
 * @returns {JSON} - Success message or error response.
 */
export const deleteAgent = async (req, res, next) => {
  try {
    const { id } = req.params;

    await deleteAgentService(id);

    return res.status(200).json({
      success: true,
      message: 'Agent deleted successfully!',
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Controller to update a specific agent's information.
 * @route   PUT /api/agent/:id
 * @access  Private (Agent or Super Admin)
 * @param   {Object} req - Express request object containing the agent ID in params and updated data in the body.
 * @param   {Object} res - Express response object for sending the updated agent data.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - Success response with updated agent data or error.
 */
export const updateAgent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userRole = req.user.role;

    const updatedAgent = await updateAgentService(id, updates, userRole);

    const sanitizedUpdatedAgent = excludeSensitiveInfo(updatedAgent, ['password', '__v']);

    return res.status(200).json({
      success: true,
      message: 'Agent information updated successfully.',
      data: sanitizedUpdatedAgent,
    });
  } catch (error) {
    return next(error);
  }
};


/**
 * @desc Controller to update the status of an agent (admin-only)
 * @route PUT /api/agent/:id/status
 * @access Private (Admin)
 * @param {Object} req - The request object containing agent ID and new status.
 * @param {Object} res - The response object used to send the updated agent details.
 * @param {Function} next - Express middleware function for error handling.
 * @returns {JSON} - Success message and updated agent data.
 */
export const updateAgentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { agentStatus } = req.body;

    // Call the service layer to update agent status
    const updatedAgent = await updateAgentStatusService(id, agentStatus);

    // Send response with updated agent data
    return res.status(200).json({
      success: true,
      message: `Agent status updated to ${agentStatus}`,
      data: {
        id: updatedAgent._id,
        firstName: updatedAgent.firstName,
        lastName: updatedAgent.lastName,
        email: updatedAgent.email,
        agentStatus: updatedAgent.agentStatus,
      },
    });
  } catch (error) {
    return next(error);  // Pass the error to the global error handler
  }
};

