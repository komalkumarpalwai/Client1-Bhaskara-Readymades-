import { orderService } from '../services/orderService.js';
import { sendSuccess } from '../utils/response.js';

export const orderController = {
  createOrder: async (req, res, next) => {
    try {
      const order = await orderService.createOrder(req.body);
      return sendSuccess(res, 201, 'Order created successfully', { order });
    } catch (err) {
      next(err);
    }
  },

  getOrders: async (req, res, next) => {
    try {
      const orders = await orderService.getOrders(req.query);
      return sendSuccess(res, 200, 'Orders retrieved successfully', {
        orders,
        total: orders.length
      });
    } catch (err) {
      next(err);
    }
  },

  getOrderById: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const order = await orderService.getOrderById(orderId);
      return sendSuccess(res, 200, `Order details for ${orderId}`, { order });
    } catch (err) {
      next(err);
    }
  }
};
