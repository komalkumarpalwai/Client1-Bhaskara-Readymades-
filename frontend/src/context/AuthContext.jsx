import React, { createContext, useContext, useState, useMemo } from 'react';
import api from '../services/api.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password, role = 'CUSTOMER') => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password, role });
      const authData = response.data || response;
      const loggedUser = authData.user;
      const authToken = authData.token;

      setUser(loggedUser);
      setToken(authToken);

      if (authToken) localStorage.setItem('auth_token', authToken);
      if (loggedUser) localStorage.setItem('auth_user', JSON.stringify(loggedUser));

      return loggedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', userData);
      const authData = response.data || response;
      const registeredUser = authData.user;
      const authToken = authData.token;

      setUser(registeredUser);
      setToken(authToken);

      if (authToken) localStorage.setItem('auth_token', authToken);
      if (registeredUser) localStorage.setItem('auth_user', JSON.stringify(registeredUser));

      return registeredUser;
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = Boolean(user && (user.role === 'ADMIN' || user.role === 'admin'));

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user || token),
      isAdmin,
      isLoading,
      login,
      logout,
      register
    }),
    [user, token, isAdmin, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
