import { sfOrderService } from './salesforce/orderService.js';
import { logger } from '../utils/logger.js';

export const orderService = {
  async getOrders(filters = {}) {
    return await sfOrderService.fetchOrders();
  },

  async getOrderById(orderId) {
    return await sfOrderService.fetchOrderById(orderId);
  },

  async createOrder(orderPayload) {
    return await sfOrderService.createSalesforceOrder(orderPayload);
  }
};
