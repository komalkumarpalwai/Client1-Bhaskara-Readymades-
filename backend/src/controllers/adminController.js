import { productService } from '../services/productService.js';
import { orderService } from '../services/orderService.js';
import { customerService } from '../services/customerService.js';
import { sendSuccess } from '../utils/response.js';

export const adminController = {
  // Products
  getProducts: async (req, res, next) => {
    try {
      const products = await productService.getAllProducts(req.query);
      return sendSuccess(res, 200, 'Admin products list ready', { products });
    } catch (err) {
      next(err);
    }
  },

  getProductById: async (req, res, next) => {
    try {
      const { productId } = req.params;
      const product = await productService.getProductById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found in Salesforce' });
      }
      return sendSuccess(res, 200, `Salesforce product details for ${productId}`, { product });
    } catch (err) {
      next(err);
    }
  },

  createProduct: async (req, res, next) => {
    try {
      const product = await productService.createProduct(req.body);
      return sendSuccess(res, 201, 'Product created successfully in Salesforce Product2', { product });
    } catch (err) {
      next(err);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const { productId } = req.params;
      const product = await productService.updateProduct(productId, req.body);
      return sendSuccess(res, 200, `Product ${productId} updated`, { product });
    } catch (err) {
      next(err);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const { productId } = req.params;
      const result = await productService.deleteProduct(productId);
      return sendSuccess(res, 200, `Product ${productId} deleted`, result);
    } catch (err) {
      next(err);
    }
  },

  // Orders
  getOrders: async (req, res, next) => {
    try {
      const orders = await orderService.getOrders(req.query);
      return sendSuccess(res, 200, 'Admin orders list ready', { orders });
    } catch (err) {
      next(err);
    }
  },

  getOrderById: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const order = await orderService.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found in Salesforce' });
      }
      return sendSuccess(res, 200, `Admin order details for ${orderId}`, { order });
    } catch (err) {
      next(err);
    }
  },

  updateOrderStatus: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const result = await orderService.updateOrderStatus(orderId, status);
      return sendSuccess(res, 200, `Order ${orderId} status updated to ${status}`, result);
    } catch (err) {
      next(err);
    }
  },

  // Customers / Leads
  getCustomers: async (req, res, next) => {
    try {
      const customers = await customerService.getCustomers(req.query);
      return sendSuccess(res, 200, 'Admin customers list ready', { customers });
    } catch (err) {
      next(err);
    }
  },

  getCustomerById: async (req, res, next) => {
    try {
      const { customerId } = req.params;
      const customer = await customerService.getCustomerById(customerId);
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Lead not found in Salesforce' });
      }
      return sendSuccess(res, 200, `Admin customer lead details for ${customerId}`, { customer });
    } catch (err) {
      next(err);
    }
  }
};
