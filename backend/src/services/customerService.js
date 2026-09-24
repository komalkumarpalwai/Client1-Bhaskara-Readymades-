import { sfCustomerService } from './salesforce/customerService.js';
import { logger } from '../utils/logger.js';

export const customerService = {
  async getCustomers(filters = {}) {
    return await sfCustomerService.fetchLeads();
  },

  async getCustomerById(customerId) {
    return await sfCustomerService.fetchLeadById(customerId);
  },

  async createOrUpdateCustomer(data) {
    return await sfCustomerService.createLead(data);
  }
};
