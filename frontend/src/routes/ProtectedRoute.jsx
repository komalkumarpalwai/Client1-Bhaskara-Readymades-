import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * ProtectedRoute Component Placeholder
 * Future logic: redirects unauthenticated users to /login
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Architectural placeholder: allows pass-through in development foundation
  // In production phase:
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
