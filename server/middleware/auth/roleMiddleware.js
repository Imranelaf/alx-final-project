import { ForbiddenError } from '../../utils/customErrors.js';  // Import custom ForbiddenError

/**
 * @desc - Check if the user is an admin
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 * @throws {ForbiddenError} - Throws 403 Forbidden if the user is not an admin
 */
export const checkIsAdmin = (req, res, next) => {
  // Check if the user is authenticated and has the role 'admin' or 'super-admin'
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super-admin')) {
    return next();  // Proceed if the user is an admin or super-admin
  }

  // If the user is not an admin, throw a ForbiddenError
  return next(new ForbiddenError('Access forbidden: Admins only.'));
};

/**
 * @desc - Check if the user is a super admin
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 * @throws {ForbiddenError} - Throws 403 Forbidden if the user is not a super admin
 */
export const checkIsSuperAdmin = (req, res, next) => {
  // Check if the user is authenticated and has the role 'super-admin'
  if (req.user && req.user.role === 'super-admin') {
    return next();  // Proceed if the user is a super-admin
  }

  // If the user is not a super-admin, throw a ForbiddenError
  return next(new ForbiddenError('Access denied: You do not have the required permissions to perform this action.'));
};

/**
 * @desc - Check if the user is either the admin they are modifying or a super admin
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 * @throws {ForbiddenError} - Throws 403 Forbidden if the user is neither the admin themselves nor a super admin
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

  // If neither, deny access with a ForbiddenError
  return next(new ForbiddenError('Access denied: You do not have the required permissions to perform this action.'));
};

/**
 * @desc - Middleware to check if the user is either an admin or the agent themselves
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 * @throws {ForbiddenError} - Throws 403 Forbidden if the user is neither the admin nor the agent
 */
export const checkIsAgentSelfOrAdmin = (req, res, next) => {
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

  // If neither condition is met, deny access with a ForbiddenError
  return next(new ForbiddenError('Access denied: You do not have the required permissions to perform this action.'));
};

/**
 * Middleware to check if the user is either an admin or the user themselves.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} - Calls next if authorized, throws ForbiddenError otherwise.
 */
export const checkIsUserSelfOrAdmin = (req, res, next) => {
  const { id } = req.params;  // The user ID being accessed from the URL
  const { role, id: userId } = req.user;  // The logged-in user's role and ID from JWT payload

  // Allow access if the user is an admin
  if (role === 'admin' || role === 'super-admin') {
    return next();
  }

  // Allow access if the user is updating their own account
  if (userId === id) {
    return next();
  }

  // If neither condition is met, deny access with a ForbiddenError
  return next(new ForbiddenError('Access denied: You do not have the required permissions to perform this action.'));
};

