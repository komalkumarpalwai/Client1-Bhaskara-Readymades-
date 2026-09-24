import api from './api.js';

export const createOrder = async (orderData) => {
  return await api.post('/orders', orderData);
};

export const getOrders = async (params = {}) => {
  return await api.get('/orders', { params });
};

export const getOrderById = async (orderId) => {
  return await api.get(`/orders/${orderId}`);
};

export const cancelOrder = async (orderId) => {
  return await api.post(`/orders/${orderId}/cancel`);
};

export default {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder
};
