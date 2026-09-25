import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

/**
 * Route Guard for Admin Portal
 * Ensures only authenticated users with ADMIN role can access admin sub-routes
 */
const AdminRoute = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <LoadingSpinner message="Verifying Admin Authorization..." minHeight="min-h-screen" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default AdminRoute;
