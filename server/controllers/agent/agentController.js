import Agent from '../../models/Agent.js';
import { validationResult } from 'express-validator';
import { formatError } from '../../utils/errorFormatter.js';
import { generateJWT, setTokenCookie } from '../../utils/authHelpers.js';
import {isValidObjectId} from '../../utils/mongooseUtils.js';
import passport from 'passport';
import '../../config/passport.js';

/**
 * @desc    Controller to handle the registration of new agents.
 * @param   {Object} req - Express request object containing the agent's data in the body.
 * @param   {Object} res - Express response object used to send the result of the registration process.
 * @param   {Function} next - Express middleware function for passing control to the next middleware in case of errors.
 * @returns {JSON} - Success response with the created agent's data and a JWT token
 * @throws  {JSON} - If validation or business logic errors occur, or if there's a server error during registration.
 */
export const createAgent = async (req, res, next) => {
  let errors = [];

  // Collect validation errors from express-validator
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    errors = validationErrors.array().map(err => ({
      field: err.path,
      message: err.msg,
    }));
  }

  const {
    firstName,
    lastName,
    username,
    email,
    phoneNumber,
    agency,
    bio,             // Optional field
    licenseNumber,
    profileImage,    // Optional field
    password,
    socialMediaLinks, // Optional field containing Facebook, LinkedIn, Twitter links
  } = req.body;

  try {
    const existingAgent = await Agent.findOne({
      $or: [{ username }, { email }, { phoneNumber }, { licenseNumber }]
    });

    // If existing agent found, push business logic errors
    if (existingAgent) {
      if (existingAgent.username === username) {
        errors.push({ field: 'username', message: 'Username is already in use' });
      }
      if (existingAgent.email === email) {
        errors.push({ field: 'email', message: 'Email is already in use' });
      }
      if (existingAgent.phoneNumber === phoneNumber) {
        errors.push({ field: 'phoneNumber', message: 'Phone number is already in use' });
      }
      if (existingAgent.licenseNumber === licenseNumber) {
        errors.push({ field: 'licenseNumber', message: 'License number is already in use' });
      }
    }

    // If there are any validation or business logic errors, return them
    if (errors.length > 0) {
      return next(formatError('Validation or business logic errors occurred.', errors, 400));
    }

    // Create a new agent with the provided and default fields
    const newAgent = new Agent({
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      agency,
      bio,             // Include bio if provided
      licenseNumber,
      profileImage,    // Include profileImage if provided
      password,
      socialMediaLinks, // Include socialMediaLinks if provided
      role: 'agent',   // Default role is 'agent'
      agentStatus: 'pending'  // Set default status to 'pending', this won't be provided by user
    });

    // Save the new agent to the database
    await newAgent.save();

    const token = generateJWT(newAgent, newAgent.role);

    setTokenCookie(res, token);

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Agent registered successfully. Awaiting approval.',
      data: newAgent,
    });
  } catch (error) {
    return next(formatError('Server error while registering agent', [], 500));
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
  passport.authenticate('agent-local', { session: false }, (err, agent, info) => {
    if (err) {
      return next(err); // Pass Server Error to the global error handler
    }

    if (!agent) {
      return next(info); // Pass Authentication Error to the global error handler
    }

    // Generate JWT and set it as a cookie
    const token = generateJWT(agent, agent.role); // Generate the JWT for the agent
    console.log("The token is ", token);
    setTokenCookie(res, token); // Set the JWT as a cookie

    // Return success response with agent data
    return res.status(200).json({
      success: true,
      message: 'Agent logged in successfully!',
      data: {
        id: agent._id,
        firstName: agent.firstName,
        lastName: agent.lastName,
        email: agent.email,
        role: agent.role,
      },
    });
  })(req, res, next);
};

/**
 * 
 * @desc Retrieve all agents from the database, excluding their passwords.
 * @route GET /api/agents
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @returns {JSON} - Success response with the list of agents
 * @throws {Error} - If there's a server error while fetching agents or if no agents are found
 */
export const getAllAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find().select('-password'); // Exclude password
    
    if (!agents || agents.length === 0) {
      return next(formatError('No agents found', [], 404));
    }
    
    return res.status(200).json({
      success: true,
      data: agents,
    });
  } catch (error) {
    return next(formatError('Server error while fetching agents', [], 500));
  }
};

/**
 * @desc    Get a specific agent by ID
 * @route   GET /api/agents/:id
 * @access  Public
 * @param   {Object} req - Express request object containing the agent ID
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express middleware function
 * @returns {JSON} - Success response with the agent's data
 * @throws  {Error} - If the agent ID is invalid, if the agent is not found, or if there's a server error while fetching the agent
 */
export const getAgentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
      return next(formatError('Invalid agent ID', [], 400));
    }

    const agent = await Agent.findById(req.params.id).select('-password'); // Exclude password

    if (!agent) {
      return next(formatError('Agent not found', [], 404));
    }

    return res.status(200).json({
      success: true,
      data: agent,
    });

  } catch (error) {
    return next(formatError('Server error while fetching agent', [], 500));
  }
};

/**
 * @desc Controller to update the status of an agent (admin-only)
 * @param {Object} req - The request object containing agent ID and new status.
 * @param {Object} res - The response object used to send the updated agent details.
 * @param {Function} next - Express middleware function for error handling.
 * @returns {JSON} - Success message and updated agent data.
 * @throws {Error} - If the agent is not found or invalid status is provided.
 */
export const updateAgentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { agentStatus } = req.body;

    // Check if the ID is a valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
      return next(formatError('Invalid agent ID', [], 400));
    }

    // Ensure the provided agentStatus is valid
    const validStatuses = ['pending', 'active', 'rejected'];
    if (!validStatuses.includes(agentStatus)) {
      return next(formatError('Invalid status provided', [], 400));
    }

    // Find the agent by ID
    const agent = await Agent.findById(id);
    if (!agent) {
      return next(formatError('Agent not found', [], 404));
    }

    // Update the agent's status
    agent.agentStatus = agentStatus;

    // Save the updated agent
    await agent.save();

    // Send the updated agent data as the response
    return res.status(200).json({
      success: true,
      message: `Agent status updated to ${agentStatus}`,
      data: {
        id: agent._id,
        firstName: agent.firstName,
        lastName: agent.lastName,
        email: agent.email,
        agentStatus: agent.agentStatus,
      },
    });
  } catch (error) {
    return next(formatError('Server error while updating agent status', [], 500));
  }
};

/**
 * @desc Update an agent's information in the database
 * @param {Object} req - Express request object containing agent ID and update data
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @returns {JSON} - Success message and updated agent data 
 * @throws {Error} - If the agent ID is invalid, validation fails, or the agent is not found
 */
export const updateAgent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if the ID is a valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
      return next(formatError('Invalid agent ID', [], 400));
    }

    // Extract validation errors from the request
    const validationErrors = validationResult(req);
    let errors = [];

    // Handle validation errors from express-validator
    if (!validationErrors.isEmpty()) {
      errors = validationErrors.array().map(err => ({
        field: err.param,
        message: err.msg,
      }));
    }

    // Prevent updates to restricted fields, e.g., role, agentStatus, etc.
    if (updates.role) {
      errors.push({
        field: 'role',
        message: 'You are not allowed to update the role.',
      });
      delete updates.role;
    }

    if (updates.agentStatus) {
      errors.push({
        field: 'agentStatus',
        message: 'You are not allowed to update agent status.',
      });
      delete updates.agentStatus;
    }

    // Stop the process if any validation or restricted field errors exist
    if (errors.length > 0) {
      return next(formatError('Validation failed for some fields.', errors, 400));
    }

    // Attempt to find and update the agent
    const updatedAgent = await Agent.findByIdAndUpdate(id, { $set: updates }, {
      new: true, // Return the updated document
      runValidators: true, // Apply schema validations for fields like email and phone number
    }).select('-password'); // Exclude password from the response

    // If agent not found, return a 404 error
    if (!updatedAgent) {
      return next(formatError('Agent not found', [], 404));
    }

    // Return success response with the updated fields
    return res.status(200).json({
      success: true,
      message: 'Agent information updated successfully.',
      data: updatedAgent,
    });

  } catch (error) {
    // Catch Mongoose validation errors
    if (error.name === 'ValidationError') {
      const mongooseErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message,
      }));
      return next(formatError('Validation failed for some fields.', mongooseErrors, 400));
    }

    // Catch and handle other server-side errors
    return next(formatError('Server error while updating agent information', [], 500));
  }
};

/**
 * @desc Delete an agent from the database
 * @param {Object} req - Express request object containing the agent ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @returns {JSON} - Success message after deleting the agent 
 * @throws {Error} - If the agent id is invalid or if not found or if there's a server error while deleting the agent
 */
export const deleteAgent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return next(formatError('Invalid agent ID', [], 400));
    }

    const agentToDelete = await Agent.findById(id);

    if (!agentToDelete) {
      return next(formatError('Agent not found', [], 404));
    }

    await agentToDelete.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Agent deleted successfully.',
    });
  } catch (error) {
    return next(formatError('Server error while deleting agent', [], 500));
  }
};
