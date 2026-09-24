import api from './api.js';

export const getCart = async () => {
  return await api.get('/cart');
};

export const addToCart = async (item) => {
  return await api.post('/cart/items', item);
};

export const updateCartItem = async (itemId, quantity) => {
  return await api.put(`/cart/items/${itemId}`, { quantity });
};

export const removeFromCart = async (itemId) => {
  return await api.delete(`/cart/items/${itemId}`);
};

export const clearCart = async () => {
  return await api.delete('/cart');
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
