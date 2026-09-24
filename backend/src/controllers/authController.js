import { sendSuccess, sendError } from '../utils/response.js';
import { ENV } from '../config/env.js';

export const authController = {
  login: async (req, res, next) => {
    try {
      const { email, password, role } = req.body || {};

      if (!email || !password) {
        return sendError(res, 400, 'Email and password are required');
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Check for Admin authentication request
      if (role === 'ADMIN' || normalizedEmail === ENV.ADMIN.EMAIL) {
        if (normalizedEmail === ENV.ADMIN.EMAIL && password === ENV.ADMIN.PASSWORD) {
          const token = `token-admin-${Date.now()}`;
          return sendSuccess(res, 200, 'Admin authentication successful', {
            token,
            user: {
              id: 'admin-master',
              email: ENV.ADMIN.EMAIL,
              name: 'Store Administrator',
              role: 'ADMIN'
            }
          });
        } else {
          return sendError(res, 401, 'Invalid administrator email or password');
        }
      }

      // Customer Authentication
      const token = `token-customer-${Date.now()}`;
      return sendSuccess(res, 200, 'Customer login successful', {
        token,
        user: {
          id: `usr-${Date.now()}`,
          email: normalizedEmail,
          name: normalizedEmail.split('@')[0],
          role: 'CUSTOMER'
        }
      });
    } catch (err) {
      next(err);
    }
  },

  register: async (req, res, next) => {
    try {
      const { email, password, name } = req.body || {};
      if (!email || !password) {
        return sendError(res, 400, 'Email and password are required');
      }

      return sendSuccess(res, 201, 'Registration successful', {
        token: `token-customer-${Date.now()}`,
        user: {
          id: `usr-${Date.now()}`,
          email: email.trim().toLowerCase(),
          name: name || 'Valued Customer',
          role: 'CUSTOMER'
        }
      });
    } catch (err) {
      next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      return sendSuccess(res, 200, 'Logout successful');
    } catch (err) {
      next(err);
    }
  },

  getCurrentUser: async (req, res, next) => {
    try {
      return sendSuccess(res, 200, 'Current user profile', {
        user: req.user || { role: 'CUSTOMER' }
      });
    } catch (err) {
      next(err);
    }
  }
};
