import api from './api.js';

export const login = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

export const register = async (userData) => {
  return await api.post('/auth/register', userData);
};

export const logout = async () => {
  return await api.post('/auth/logout');
};

export const getCurrentUser = async () => {
  return await api.get('/auth/me');
};

export default {
  login,
  register,
  logout,
  getCurrentUser
};
