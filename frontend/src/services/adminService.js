import api from './api.js';

export const createProduct = async (productData) => {
  return await api.post('/admin/products', productData);
};

export const updateProduct = async (productId, productData) => {
  return await api.put(`/admin/products/${productId}`, productData);
};

export const deleteProduct = async (productId) => {
  return await api.delete(`/admin/products/${productId}`);
};

export const getAdminProducts = async (params = {}) => {
  return await api.get('/admin/products', { params });
};

export const getAdminOrders = async (params = {}) => {
  return await api.get('/admin/orders', { params });
};

export const updateOrderStatus = async (orderId, status) => {
  return await api.put(`/admin/orders/${orderId}/status`, { status });
};

export const getCustomers = async (params = {}) => {
  return await api.get('/admin/customers', { params });
};

export default {
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
  getAdminOrders,
  updateOrderStatus,
  getCustomers
};
