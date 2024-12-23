/**
 * This file 
 */

import passport from 'passport';
import '../../config/passport.js';
import {generateTokenAndCookieOptions, setTokenCookie } from '../../utils/authHelpers.js';
import {excludeSensitiveInfo} from '../../utils/excludeSensitiveInfo.js';
import { UnauthorizedError } from '../../utils/customErrors.js';  // Adjust path if needed
import { createNewAgent, } from '../../services/agentService.js';


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
      const newAgent = await createNewAgent(req.body);
  
      const { token, cookieOptions } = generateTokenAndCookieOptions(newAgent);
  
      setTokenCookie(res, token, cookieOptions);
  
      const agentResponse = excludeSensitiveInfo(newAgent, ['password', '__v']);
  
      return res.status(201).json({
        success: true,
        message: 'Agent created successfully.',
        data: agentResponse,
        token
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
        return next(err);
      }
  
      if (!agent) {
        const error = new UnauthorizedError(info?.message || 'Authentication failed');
        return next(error);
      }
  
      try {
        const { token, cookieOptions } = generateTokenAndCookieOptions(agent);
        
        setTokenCookie(res, token, cookieOptions);
  
  
        const agentResponse = excludeSensitiveInfo(agent, ['password', '__v']);
  
  
        return res.status(200).json({
          success: true,
          message: 'Agent logged in successfully!',
          data: agentResponse,
          token
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  };