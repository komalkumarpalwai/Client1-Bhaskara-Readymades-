import { customerService } from '../services/customerService.js';
import { sendSuccess } from '../utils/response.js';

export const customerController = {
  getProfile: async (req, res, next) => {
    try {
      const customerId = req.user?.id || req.params.id;
      const customer = await customerService.getCustomerById(customerId);
      return sendSuccess(res, 200, 'Customer profile API placeholder ready', { customer });
    } catch (err) {
      next(err);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const customer = await customerService.createOrUpdateCustomer(req.body);
      return sendSuccess(res, 200, 'Customer profile updated', { customer });
    } catch (err) {
      next(err);
    }
  },

  createLead: async (req, res, next) => {
    try {
      const lead = await customerService.createOrUpdateCustomer(req.body);
      return sendSuccess(res, 201, 'Inquiry received and Salesforce Lead created successfully', {
        lead,
        receivedData: req.body
      });
    } catch (err) {
      next(err);
    }
  }
};

