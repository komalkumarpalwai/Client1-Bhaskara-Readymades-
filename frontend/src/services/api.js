import axios from 'axios';
import { ENV } from '../config/env.js';

/**
 * Centralized Axios API Client Instance
 */
const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Request interceptor to attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for centralized error transformation
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'API request failed',
      status: error.response?.status,
      data: error.response?.data
    };
    return Promise.reject(customError);
  }
);

export default api;
