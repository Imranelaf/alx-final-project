/*
Defines admin routes for management, login, and CRUD operations, with role-based access and JWT protection.
*/

import express from 'express';
import {
  createAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from '../controllers/admin/adminController.js';
import authenticateJWT from '../middleware/auth/authMiddleware.js';  // JWT auth middleware for protected routes
import { checkIsAdmin, checkIsSuperAdmin, checkIsAdminSelfOrSuperAdmin} from '../middleware/auth/roleMiddleware.js';  // Role-based access control for admin/super-admin
import { validateAdminFields } from '../middleware/validation/adminValidation.js';  // Input validation for admin

const router = express.Router();

/**
 * ============================
 * Admin Routes
 * ============================
 */

// Admin Management

router.post('/', authenticateJWT, checkIsSuperAdmin, validateAdminFields, createAdmin); // Create a new admin (super admin only)
router.post('/login', loginAdmin); // Admin login route (public route)
router.get('/', authenticateJWT, checkIsAdmin, getAllAdmins);        // Get all admins (admin-only route)
router.get('/:id', authenticateJWT, checkIsAdmin, getAdminById);     // Get a specific admin by ID (admin-only)
router.put('/:id', authenticateJWT, checkIsAdminSelfOrSuperAdmin, updateAdmin);      // Update admin information (admin-only)
router.delete('/:id', authenticateJWT, checkIsAdminSelfOrSuperAdmin, deleteAdmin);  // Delete an admin (super admin only)

export default router;
