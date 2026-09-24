import api from './api.js';

export const getProducts = async (params = {}) => {
  return await api.get('/products', { params });
};

export const getProductById = async (productId) => {
  return await api.get(`/products/${productId}`);
};

export const searchProducts = async (query) => {
  return await api.get('/products/search', { params: { q: query } });
};

export const getProductsByCategory = async (category) => {
  return await api.get(`/products/category/${category}`);
};

export default {
  getProducts,
  getProductById,
  searchProducts,
  getProductsByCategory
};
