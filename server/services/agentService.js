import { checkDuplicateFields } from '../utils/checkDuplicateFields.js';
import Agent from '../models/Agent.js';
import {isValidObjectId} from '../utils/mongooseUtils.js';
import { 
  BusinessLogicError, 
  ServerError, 
  NotFoundError, 
  ValidationError
} from '../utils/customErrors.js';
import { removeRestrictedFields } from '../utils/removeRestrictedFields.js';

/**
 * Business logic to create a new agent.
 * @param {Object} agentData - The data for creating the new agent.
 * @throws {BusinessLogicError | ServerError} - Throws specific errors if necessary.
 * @returns {Object} - The newly created agent.
 */
export const createNewAgent = async (agentData) => {
  try {
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
    } = agentData;  // Only pick the fields needed for agent creation

    // Check for duplicate fields
    const duplicateErrors = await checkDuplicateFields(Agent, { username, email, phoneNumber, licenseNumber });

    // If duplicates are found, throw a BusinessLogicError
    if (duplicateErrors.length > 0) {
      throw new BusinessLogicError('Duplicate fields found', duplicateErrors);
    }

    // Proceed with creating the agent
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
      agentStatus: 'pending'  // Default status is 'pending'
    });

    // Save the new agent to the database
    await newAgent.save();

    // Return the new agent
    return newAgent;

  } catch (error) {
    // Rethrow known errors or throw ServerError for unexpected cases
    if (error instanceof BusinessLogicError) {
      throw error;
    } else {
      throw new ServerError('Error creating agent'); // Default to a server error
    }
  }
};

/**
 * @desc    Service to fetch agents based on filters, or return all agents if no filters are provided.
 * @param   {Object} filters - Query parameters used for filtering agents.
 * @returns {Array} - Array of agents that match the filters or all agents if no filters are applied.
 */
export const getAgentsByFilterService = async (filters) => {
  try {
    // Initialize an empty query object
    const query = {};

    // Add filters dynamically based on query parameters

    if (filters.firstName) {
      query.firstName = { $regex: filters.firstName, $options: 'i' };  // Case-insensitive match for first name
    }

    if (filters.lastName) {
      query.lastName = { $regex: filters.lastName, $options: 'i' };  // Case-insensitive match for last name
    }

    if (filters.username) {
      query.username = { $regex: filters.username, $options: 'i' };  // Case-insensitive match for username
    }

    if (filters.agency) {
      query.agency = { $regex: filters.agency, $options: 'i' };  // Case-insensitive match for agency name
    }

    if (filters.phoneNumber) {
      query.phoneNumber = filters.phoneNumber;
    }

    if (filters.email) {
      query.email = { $regex: filters.email, $options: 'i' };  // Case-insensitive match for email
    }

    if (filters.licenseNumber) {
      query.licenseNumber = filters.licenseNumber;  // Exact match for license number
    }      

    if (filters.agentStatus) {
      query.agentStatus = filters.agentStatus;  // E.g., pending, active, rejected
    }

    if (filters.ratingMin || filters.ratingMax) {
      query.rating = {};
      if (filters.ratingMin) query.rating.$gte = parseFloat(filters.ratingMin);
      if (filters.ratingMax) query.rating.$lte = parseFloat(filters.ratingMax);
    }

    if (filters.reviewsCountMin || filters.reviewsCountMax) {
      query.reviewsCount = {};
      if (filters.reviewsCountMin) query.reviewsCount.$gte = parseInt(filters.reviewsCountMin, 10);
      if (filters.reviewsCountMax) query.reviewsCount.$lte = parseInt(filters.reviewsCountMax, 10);
    }

    // Execute the query to fetch agents from the database
    const agents = await Agent.find(query);

    // Return the array of agents
    return agents;
  } catch (error) {
    throw new ServerError('Error fetching agents from the database');
  }
};

/**
 * Service to retrieve an agent by ID.
 * @param {string} id - The agent's ID from the request parameters.
 * @returns {Object} - Returns the found agent object or throws an error.
 */
export const getAgentByIdService = async (id) => {
  try {
    // Find the agent by ID
    const agent = await Agent.findById(id);

    if (!agent) {
      throw new NotFoundError('Agent not found');
    }

    // Return the agent data
    return agent;
  } catch (error) {
    // Handle specific and unexpected errors
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ServerError('Error retrieving agent');
  }
};

/**
 * Service to delete an agent by ID.
 * @param {string} id - The agent's ID from the request parameters.
 * @throws {ValidationError} - If the ID is not a valid MongoDB ObjectId.
 * @throws {NotFoundError} - If the agent with the provided ID is not found.
 * @throws {ServerError} - For any server errors that occur.
 */
export const deleteAgentService = async (id) => {
  try {
    // Find the agent by ID
    const agent = await Agent.findById(id);
    if (!agent) {
      throw new NotFoundError('Agent not found');
    }

    // Delete the agent
    await agent.deleteOne();
  } catch (error) {
    // Handle specific errors or throw ServerError for unexpected cases
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new ServerError('Error deleting agent');
  }
};

/**
 * Service to update a specific agent's information.
 * @param {string} id - The agent's ID.
 * @param {Object} updates - The updates to be applied to the agent.
 * @param {string} userRole - The role of the user making the update request (either 'agent' or 'super-admin').
 * @throws {ValidationError} - If the ID or fields are invalid.
 * @throws {NotFoundError} - If the agent is not found.
 * @throws {ForbiddenError} - If the user is not allowed to update 'role' or 'permissions'.
 * @throws {ServerError} - For any server-side errors that occur.
 * @returns {Object} - The updated agent object.
 */
export const updateAgentService = async (id, updates, userRole) => {
  try {

    // List of fields that cannot be modified
    const restrictedFields = ['role', 'rating', 'reviews', 'joinedAt'];
    // Remove restricted fields from updates using the utility function
    const sanitizedUpdates = removeRestrictedFields(updates, restrictedFields);

    // Attempt to find and update the agent
    const updatedAgent = await Agent.findByIdAndUpdate(id, sanitizedUpdates, {
      new: true,  // Return the updated document
      runValidators: true,  // Apply schema validations for fields like email and phone number
    });

    if (!updatedAgent) {
      throw new NotFoundError('Agent not found');
    }

    return updatedAgent;

  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      throw new MongooseValidationError(error);
    } else if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;  // Propagate known errors
    }

    // Handle any unexpected server-side errors
    throw new ServerError('Server error while updating agent information');
  }
};

/**
 * Service to update the status of a specific agent.
 * @param {string} id - The agent's ID.
 * @param {string} agentStatus - The new status to be applied to the agent.
 * @throws {ValidationError} - If the ID or status is invalid.
 * @throws {NotFoundError} - If the agent is not found.
 * @throws {ServerError} - For any server-side errors that occur.
 * @returns {Object} - The updated agent object.
 */
export const updateAgentStatusService = async (id, agentStatus) => {
  try {
    // Ensure the provided agentStatus is valid
    const validStatuses = ['pending', 'active', 'rejected'];
    if (!validStatuses.includes(agentStatus)) {
      throw new ValidationError('Invalid status provided');
    }

    // Find the agent by ID
    const agent = await Agent.findById(id);
    if (!agent) {
      throw new NotFoundError('Agent not found');
    }

    // Update the agent's status
    agent.agentStatus = agentStatus;

    // Save the updated agent
    await agent.save();

    return agent;  // Return the updated agent
  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;  // Rethrow known errors
    }

    // Handle any unexpected server-side errors
    throw new ServerError('Server error while updating agent status');
  }
};
