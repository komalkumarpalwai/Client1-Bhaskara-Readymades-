import React from 'react';
import { Route } from 'react-router-dom';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx';
import AdminProductsPage from '../pages/admin/AdminProductsPage.jsx';
import AdminCreateProductPage from '../pages/admin/AdminCreateProductPage.jsx';
import AdminProductDetailsPage from '../pages/admin/AdminProductDetailsPage.jsx';
import AdminEditProductPage from '../pages/admin/AdminEditProductPage.jsx';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage.jsx';
import AdminInventoryPage from '../pages/admin/AdminInventoryPage.jsx';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage.jsx';
import AdminOrderDetailsPage from '../pages/admin/AdminOrderDetailsPage.jsx';
import AdminCustomersPage from '../pages/admin/AdminCustomersPage.jsx';
import AdminCustomerDetailsPage from '../pages/admin/AdminCustomerDetailsPage.jsx';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage.jsx';

import AdminRoute from './AdminRoute.jsx';

export const renderAdminRoutes = () => (
  <Route element={<AdminRoute />}>
    <Route index element={<AdminDashboardPage />} />
    <Route path="dashboard" element={<AdminDashboardPage />} />

    {/* Admin Products */}
    <Route path="products" element={<AdminProductsPage />} />
    <Route path="products/new" element={<AdminCreateProductPage />} />
    <Route path="products/:productId" element={<AdminProductDetailsPage />} />
    <Route path="products/:productId/edit" element={<AdminEditProductPage />} />

    {/* Admin Inventory & Categories */}
    <Route path="categories" element={<AdminCategoriesPage />} />
    <Route path="inventory" element={<AdminInventoryPage />} />

    {/* Admin Orders */}
    <Route path="orders" element={<AdminOrdersPage />} />
    <Route path="orders/:orderId" element={<AdminOrderDetailsPage />} />

    {/* Admin Customers */}
    <Route path="customers" element={<AdminCustomersPage />} />
    <Route path="customers/:customerId" element={<AdminCustomerDetailsPage />} />

    {/* Admin Settings */}
    <Route path="settings" element={<AdminSettingsPage />} />
  </Route>
);
