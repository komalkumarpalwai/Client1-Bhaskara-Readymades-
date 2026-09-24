export const ROUTES = Object.freeze({
  // Public
  HOME: '/',
  SHOP: '/shop',
  PRODUCTS: '/products',
  PRODUCT_DETAILS: '/products/:productId',
  CATEGORY: '/category/:category',
  CATEGORY_MEN: '/category/men',
  CATEGORY_WOMEN: '/category/women',
  CATEGORY_KIDS: '/category/kids',
  SEARCH: '/search',
  NEW_ARRIVALS: '/new-arrivals',
  OFFERS: '/offers',
  ABOUT: '/about',
  CONTACT: '/contact',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Cart & Checkout
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: '/order-confirmation/:orderId',

  // Admin
  ADMIN_LOGIN: '/admin/login',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_NEW_PRODUCT: '/admin/products/new',
  ADMIN_PRODUCT_DETAILS: '/admin/products/:productId',
  ADMIN_EDIT_PRODUCT: '/admin/products/:productId/edit',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_INVENTORY: '/admin/inventory',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ORDER_DETAILS: '/admin/orders/:orderId',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_CUSTOMER_DETAILS: '/admin/customers/:customerId',
  ADMIN_SETTINGS: '/admin/settings'
});
