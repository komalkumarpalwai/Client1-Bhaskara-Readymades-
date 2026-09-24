import React from 'react';
import { Route } from 'react-router-dom';

// Public Pages
import HomePage from '../pages/public/HomePage.jsx';
import ShopPage from '../pages/public/ShopPage.jsx';
import ProductsPage from '../pages/public/ProductsPage.jsx';
import ProductDetailsPage from '../pages/public/ProductDetailsPage.jsx';
import CategoryPage from '../pages/public/CategoryPage.jsx';
import MenPage from '../pages/public/MenPage.jsx';
import WomenPage from '../pages/public/WomenPage.jsx';
import KidsPage from '../pages/public/KidsPage.jsx';
import SearchPage from '../pages/public/SearchPage.jsx';
import NewArrivalsPage from '../pages/public/NewArrivalsPage.jsx';
import OffersPage from '../pages/public/OffersPage.jsx';
import AboutPage from '../pages/public/AboutPage.jsx';
import ContactPage from '../pages/public/ContactPage.jsx';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx';

// Cart & Checkout Pages
import CartPage from '../pages/cart/CartPage.jsx';
import CheckoutPage from '../pages/checkout/CheckoutPage.jsx';
import OrderConfirmationPage from '../pages/checkout/OrderConfirmationPage.jsx';

export const renderPublicRoutes = () => (
  <>
    {/* Storefront Public Catalogue */}
    <Route index element={<HomePage />} />
    <Route path="shop" element={<ShopPage />} />
    <Route path="products" element={<ProductsPage />} />
    <Route path="products/:productId" element={<ProductDetailsPage />} />
    <Route path="category/:category" element={<CategoryPage />} />
    <Route path="category/men" element={<MenPage />} />
    <Route path="category/women" element={<WomenPage />} />
    <Route path="category/kids" element={<KidsPage />} />
    <Route path="search" element={<SearchPage />} />
    <Route path="new-arrivals" element={<NewArrivalsPage />} />
    <Route path="offers" element={<OffersPage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="contact" element={<ContactPage />} />

    {/* Authentication */}
    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
    <Route path="forgot-password" element={<ForgotPasswordPage />} />

    {/* Cart & Checkout */}
    <Route path="cart" element={<CartPage />} />
    <Route path="checkout" element={<CheckoutPage />} />
    <Route path="order-confirmation/:orderId" element={<OrderConfirmationPage />} />
  </>
);
