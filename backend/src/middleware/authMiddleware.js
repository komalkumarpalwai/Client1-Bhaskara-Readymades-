import { sendError } from '../utils/response.js';

/**
 * Customer / User Authentication Middleware Placeholder
 * TODO: Implement session / JWT verification and attach user to req.user
 */
export const authMiddleware = (req, res, next) => {
  // Architectural placeholder - allows pass-through in development foundation
  // In production phase: verify token / session and reject unauthorized requests
  req.user = req.user || {
    id: 'placeholder-user-id',
    role: 'CUSTOMER'
  };
  next();
};
