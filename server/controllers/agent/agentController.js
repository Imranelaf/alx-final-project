import Agent from '../../models/Agent.js';
import { validationResult } from 'express-validator';
import { formatError } from '../../utils/errorFormatter.js';
import {isValidObjectId} from '../../utils/mongooseUtils.js';
import passport from 'passport';
import '../../config/passport.js';
import { generateJWT, generateTokenAndCookieOptions, setTokenCookie } from '../../utils/authHelpers.js';
import {excludeSensitiveInfo} from '../../utils/excludeSensitiveInfo.js';
import { UnauthorizedError } from '../../utils/customErrors.js';  // Adjust path if needed
import {
  createNewAgent, 
  getAllAgentsService, 
  getAgentByIdService,
  deleteAgentService,
  updateAgentService,
  updateAgentStatusService, 
} from '../../services/agentService.js';


/**
 * @desc    Controller to handle the registration of new agents.
 * @param   {Object} req - Express request object containing the agent's data in the body.
 * @param   {Object} res - Express response object used to send the result of the registration process.
 * @param   {Function} next - Express middleware function for passing control to the next middleware in case of errors.
 * @returns {JSON} - Success response with the created agent's data and a JWT token
 * @throws  {JSON} - If validation or business logic errors occur, or if there's a server error during registration.
 */
export const createAgent = async (req, res, next) => {
  try {
    // Call the service layer to create a new agent
    const newAgent = await createNewAgent(req.body);

    // Generate token and get cookie options
    const { token, cookieOptions } = generateTokenAndCookieOptions(newAgent);

    // Set the JWT token in the cookie
    setTokenCookie(res, token, cookieOptions);

    // Exclude sensitive fields (like password) from the response
    const agentResponse = excludeSensitiveInfo(newAgent, ['password', '__v']);

    return res.status(201).json({
      success: true,
      message: 'Agent created successfully.',
      data: agentResponse,
    });
    
  } catch (error) {
    return next(error);
  }
};

/*
 * Controller to handle agent login using Passport local strategy.
 * This controller handles authentication, token generation, and setting the authentication cookie.
 * 
 * @param {Object} req - Express request object containing agent's login credentials.
 * @param {Object} res - Express response object used to send the login result and JWT token.
 * @param {Function} next - Express middleware function for error handling or passing control to the next middleware.
 * @returns {JSON} - Returns a success response with the agent's data and a JWT token if authentication is successful.
 * @throws {JSON} - If authentication fails, it passes an error to the global error handler.
 */
export const loginAgent = (req, res, next) => {
  passport.authenticate('agent-local', { session: false }, async (err, agent, info) => {
    if (err) {
      return next(err);  // Pass server error to the global error handler
    }

    if (!agent) {
      // Handle authentication failure
      const error = new UnauthorizedError(info?.message || 'Authentication failed');
      return next(error);
    }

    try {
      // Generate JWT token and set it as a cookie
      const { token, cookieOptions } = generateTokenAndCookieOptions(agent);
      
      // Set the JWT token in the cookie
      setTokenCookie(res, token, cookieOptions);


      const agentResponse = excludeSensitiveInfo(agent, ['password', '__v']);


      // Send the response with agent info (excluding sensitive data)
      return res.status(200).json({
        success: true,
        message: 'Agent logged in successfully!',
        data: agentResponse,
      });
    } catch (error) {
      next(error);  // Pass any unexpected error to the global error handler
    }
  })(req, res, next);
};

/**
 * @desc    Controller to handle retrieving all agent users from the database.
 * @param   {Object} req - Express request object.
 * @param   {Object} res - Express response object used to send the list of agents.
 * @param   {Function} next - Express next middleware function for error handling.
 * @returns {Object} - JSON response with the success status and list of all agents.
 */
export const getAllAgents = async (req, res, next) => {
  try {
    // Get the raw agent data from the service layer
    const agents = await getAllAgentsService();

    // Sanitize the data by excluding sensitive fields like passwords
    const sanitizedAgents = agents.map(agent => excludeSensitiveInfo(agent, ['password', '__v']));

    // Respond with the sanitized agent data
    return res.status(200).json({
      success: true,
      data: sanitizedAgents,
    });

  } catch (error) {
    return next(error); // Pass errors to the global error handler
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
    // Extract the agent ID from the request parameters
    const { id } = req.params;

    // Call the service layer to get the agent by ID
    const agent = await getAgentByIdService(id);

    // Sanitize the agent data (remove sensitive fields like password)
    const sanitizedAgent = excludeSensitiveInfo(agent, ['password', '__v']);

    // Respond with the agent data
    return res.status(200).json({
      success: true,
      data: sanitizedAgent,
    });
  } catch (error) {
    // Pass the error to the global error handler
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
    // Extract agent ID from request parameters
    const { id } = req.params;

    // Call the service to handle agent deletion
    await deleteAgentService(id);

    // Send success response after agent is deleted
    return res.status(200).json({
      success: true,
      message: 'Agent deleted successfully!',
    });
  } catch (error) {
    // Pass the error to the global error handler
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
    const userRole = req.user.role;  // Get the user's role from the request

    // Call the service to update the agent and pass the userRole
    const updatedAgent = await updateAgentService(id, updates, userRole);

    // Exclude sensitive fields like password before returning the response
    const sanitizedUpdatedAgent = excludeSensitiveInfo(updatedAgent, ['password', '__v']);

    return res.status(200).json({
      success: true,
      message: 'Agent information updated successfully.',
      data: sanitizedUpdatedAgent,
    });
  } catch (error) {
    return next(error);  // Pass the error to the global error handler
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

