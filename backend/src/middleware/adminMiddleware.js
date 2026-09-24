import { sendError } from '../utils/response.js';

/**
 * Admin Authentication Middleware Placeholder
 * TODO: Verify admin role privileges from req.user
 */
export const adminMiddleware = (req, res, next) => {
  // Architectural placeholder - allows pass-through in development foundation
  // In production phase: check req.user.role === 'ADMIN'
  req.admin = req.admin || {
    id: 'placeholder-admin-id',
    role: 'ADMIN'
  };
  next();
};
