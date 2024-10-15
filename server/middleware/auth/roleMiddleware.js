/**
 * This file contains middleware functions that check the role of the logged-in user
 * and restrict access to certain routes based on the user's role.
 */

import { formatError } from '../../utils/errorFormatter.js';

/**
 * @desc - Check if the user is an admin
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Object} - The response object
 * @throws {Error} - Returns 403 Forbidden if the user is not an admin
 */
export const checkIsAdmin = (req, res, next) => {
  // Check if the user is authenticated and has the role 'admin'
  if (req.user && req.user.role === 'admin' || req.user.role === 'super-admin') {
    return next(); // Proceed to the next middleware or controller
  }

  // If the user is not an admin, return a 403 Forbidden error
  return next({
    message: 'Access forbidden: Admins only.',
    statusCode: 403,
  });
};

/**
 * 
 * @desc - Check if the user is a super admin
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Object} - The response object
 * @throws {Error} - Returns 403 Forbidden if the user is not a super admin
 */
export const checkIsSuperAdmin = (req, res, next) => {
  // Check if the user is authenticated and has the role 'superadmin'
  if (req.user && req.user.role === 'super-admin') {
    return next(); // Proceed to the next middleware or controller
  }

  // If the user is not a superadmin, return a 403 Forbidden error
  return next(formatError(
    'Access denied: You do not have the required permissions to perform this action.',
    [],  // No additional details to pass
    403  // Forbidden status
  ));
};

/**
 * @desc - Check if the user is either the admin they are modifying or a super admin
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Object} - The response object
 * @throws {Error} - Returns 403 Forbidden if the user is neither the admin themselves nor a super admin
 */
export const checkIsAdminSelfOrSuperAdmin = (req, res, next) => {
  const { id } = req.params;  // The ID of the admin being accessed (from URL param)
  const { role, id: userId } = req.user;  // The role and ID of the logged-in user (from JWT payload)

  // Allow access if the user is a super-admin
  if (role === 'super-admin') {
    return next();
  }

  // Allow access if the user is modifying their own account
  if (userId === id) {
    return next();
  }

  // If neither, deny access with a formatted error
  return next(formatError(
    'Access denied: You do not have the required permissions to perform this action.',
    [],  // No additional details to pass
    403  // Forbidden status
  ));
};

/**
 * @desc - Middleware to check if the user is either an admin or the agent themselves
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void} - Calls the next middleware if the user is authorized
 * @throws {Error} - Returns 403 Forbidden if the user is neither the admin nor the agent
 */
/**
 * @desc - Middleware to check if the user is either an admin or the agent themselves
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void} - Calls the next middleware if the user is authorized
 * @throws {Error} - Returns 403 Forbidden if the user is neither the admin nor the agent
 */
export const checkIsAdminSelfOrAgent = (req, res, next) => {
  const { id } = req.params;  // The agent ID being accessed from the URL
  const { role, id: userId } = req.user;  // The logged-in user's role and ID from JWT payload

  // Allow access if the user is an admin (admin or super-admin)
  if (role === 'admin' || role === 'super-admin') {
    return next();
  }

  // Allow access if the user is updating their own account
  if (userId === id) {
    return next();
  }

  // If neither condition is met, deny access with a 403 Forbidden error
  return next(formatError(
    'Access forbidden: You are not authorized to update this agent.',
    [],
    403
  ));
};
