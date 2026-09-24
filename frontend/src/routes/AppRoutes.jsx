import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import AdminLoginPage from '../pages/admin/AdminLoginPage.jsx';
import { renderPublicRoutes } from './PublicRoutes.jsx';
import { renderAdminRoutes } from './AdminRoutes.jsx';

const NotFoundPage = () => (
  <div className="p-8 text-center min-h-[50vh] flex flex-col items-center justify-center">
    <h1 className="text-3xl font-bold text-rose-600">404 - Page Not Found</h1>
    <p className="mt-2 text-slate-600 text-sm">The page you requested does not exist.</p>
    <Link to="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700 underline text-sm font-semibold">
      Return to Storefront Home
    </Link>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Storefront Routes with MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {renderPublicRoutes()}
      </Route>

      {/* Standalone Admin Login (Full-screen) */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Portal with AdminLayout (Sidebar + Management) */}
      <Route path="/admin" element={<AdminLayout />}>
        {renderAdminRoutes()}
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
