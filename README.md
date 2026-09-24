# Bhaskara Readymades — Full-Stack E-Commerce Platform Base Architecture

A production-ready base architecture for an enterprise full-stack readymade garments e-commerce platform (Men's, Women's, Kids' clothing). The system is built with a decoupled architecture featuring a React + Vite frontend, a Node.js + Express API backend, and an extensible integration layer for Salesforce as the primary System of Record.

---

## 1. Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool / Bundler**: Vite
- **Language**: JavaScript (ES Modules: `.jsx`, `.js`)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **Language**: JavaScript (ES Modules: `"type": "module"`)
- **Environment Management**: dotenv
- **CORS**: cors
- **Process Manager / Watcher**: nodemon

### System of Record / Enterprise Backend
- **Salesforce**: Core data source for garment catalogues, inventory tracking, orders, and customer accounts via OAuth 2.0 REST API.

---

## 2. Architecture Overview

```text
React + Vite (Frontend)
       |
       | HTTPS REST API (CORS enabled)
       v
Node.js + Express (Backend Gateway)
       |
       | Salesforce OAuth 2.0 / REST API
       v
Salesforce Org (Products, Inventory, Orders)
```

- **Frontend Isolation**: The React client NEVER accesses Salesforce directly.
- **Credential Protection**: All Salesforce Client IDs, Secrets, Passwords, and Tokens reside strictly in backend environment variables and are excluded from git.
- **Layered Backend**: Clear separation between Routes → Controllers → Application Services → Salesforce Services → Salesforce Client.

---

## 3. Project Structure

```text
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── navigation/
│   │   │   ├── product/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   └── admin/
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   ├── auth/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   └── admin/
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   ├── PublicRoutes.jsx
│   │   │   ├── AdminRoutes.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── productService.js
│   │   │   ├── orderService.js
│   │   │   ├── cartService.js
│   │   │   ├── authService.js
│   │   │   └── adminService.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useCart.js
│   │   ├── utils/
│   │   │   └── formatters.js
│   │   ├── constants/
│   │   │   ├── routes.js
│   │   │   └── orderStatus.js
│   │   ├── config/
│   │   │   └── env.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env.example
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js
│   │   │   ├── salesforce.js
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   ├── customerController.js
│   │   │   └── adminController.js
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── customerRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── services/
│   │   │   ├── salesforce/
│   │   │   │   ├── salesforceClient.js
│   │   │   │   ├── salesforceAuth.js
│   │   │   │   ├── productService.js
│   │   │   │   ├── orderService.js
│   │   │   │   ├── customerService.js
│   │   │   │   └── inventoryService.js
│   │   │   ├── productService.js
│   │   │   ├── orderService.js
│   │   │   ├── customerService.js
│   │   │   └── cartService.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── adminMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   └── notFoundMiddleware.js
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   ├── response.js
│   │   │   └── validators.js
│   │   ├── constants/
│   │   │   ├── orderStatus.js
│   │   │   ├── productStatus.js
│   │   │   └── userRoles.js
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   │   └── api.test.js
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── docs/
│   ├── architecture/
│   │   └── architecture.md
│   ├── api/
│   │   └── api-contract.md
│   └── salesforce/
│       └── salesforce-integration.md
│
├── .gitignore
├── README.md
└── package.json
```

---

## 4. Environment Variables

### Frontend (`frontend/.env.example`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (`backend/.env.example`)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Salesforce Connected App & OAuth (DO NOT commit real values)
SALESFORCE_LOGIN_URL=https://login.salesforce.com
SALESFORCE_CLIENT_ID=
SALESFORCE_CLIENT_SECRET=
SALESFORCE_USERNAME=
SALESFORCE_PASSWORD=
SALESFORCE_SECURITY_TOKEN=
SALESFORCE_API_VERSION=v59.0
```

---

## 5. Installation & Setup

### Option 1: One-Command Root Install
From the workspace root:
```bash
npm run install:all
```
This installs dependencies for the root orchestrator, frontend, and backend.

### Option 2: Manual Directory Install
```bash
# Root
npm install

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

---

## 6. Running the Application

### Start Both Services Concurrently
From the workspace root:
```bash
npm run dev
```
- **Backend Server**: Starts with `nodemon` at `http://localhost:5000`
- **Frontend App**: Starts with `vite` at `http://localhost:3000`

### Start Individual Services
```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

---

## 7. Frontend Routes

### Public & Storefront Routes
- `/`: Home Page
- `/shop`: Shop Page
- `/products`: Products Catalogue
- `/products/:productId`: Product Details
- `/category/:category`: Generic Category
- `/category/men`: Men's Clothing
- `/category/women`: Women's Clothing
- `/category/kids`: Kids' Clothing
- `/search`: Search Results
- `/new-arrivals`: New Arrivals
- `/offers`: Offers & Discounts
- `/about`: About Us
- `/contact`: Contact Us

### Authentication Routes
- `/login`: User Login
- `/register`: User Registration
- `/forgot-password`: Password Recovery

### Cart & Checkout Flow
- `/cart`: Shopping Cart
- `/checkout`: Checkout Process
- `/order-confirmation/:orderId`: Order Confirmation

### Admin Portal Routes
- `/admin/login`: Admin Login
- `/admin`: Admin Dashboard
- `/admin/dashboard`: Admin Dashboard
- `/admin/products`: Product Listing
- `/admin/products/new`: Add Product
- `/admin/products/:productId`: Product Details
- `/admin/products/:productId/edit`: Edit Product
- `/admin/categories`: Category Management
- `/admin/inventory`: Inventory Management
- `/admin/orders`: Orders Management
- `/admin/orders/:orderId`: Order Review
- `/admin/customers`: Customer Management
- `/admin/customers/:customerId`: Customer Details
- `/admin/settings`: Store Settings

---

## 8. Backend API Structure

Base API path: `/api`

| Route | Methods | Description |
|---|---|---|
| `/api` | GET | API Health & Status |
| `/api/products` | GET | List products (filtered by category, page, etc.) |
| `/api/products/:productId` | GET | Product detail |
| `/api/products/search` | GET | Search products by query |
| `/api/products/category/:category` | GET | Category specific products |
| `/api/auth/login` | POST | Customer / Staff login |
| `/api/auth/register` | POST | Customer registration |
| `/api/auth/logout` | POST | Session invalidation |
| `/api/auth/me` | GET | Current session details |
| `/api/cart` | GET, DELETE | Manage user cart |
| `/api/cart/items` | POST | Add line item |
| `/api/cart/items/:itemId` | PUT, DELETE | Update/remove line item |
| `/api/orders` | GET, POST | Orders query and creation |
| `/api/orders/:orderId` | GET | Order details |
| `/api/customers/profile` | GET, PUT | Customer profile details |
| `/api/admin/products` | GET, POST | Admin product catalogue |
| `/api/admin/products/:productId` | PUT, DELETE | Admin product update/delete |
| `/api/admin/orders` | GET | Admin orders inspection |
| `/api/admin/orders/:orderId` | GET | Admin single order review |
| `/api/admin/orders/:orderId/status` | PUT | Admin update order status |
| `/api/admin/customers` | GET | Admin customer querying |

---

## 9. Salesforce Integration Architecture

Salesforce serves as the backend ERP for garment inventory, sales order processing, and customer profiles:
1. **`salesforceClient.js`**: Low-level REST & SOQL query execution.
2. **`salesforceAuth.js`**: OAuth 2.0 token acquisition and caching.
3. **`productService.js`**: Maps between Salesforce `Product2` / `PricebookEntry` and storefront items.
4. **`orderService.js`**: Transforms submitted orders into Salesforce `Order` and `OrderItem` records.
5. **`customerService.js`**: Synchronizes customers with Salesforce `Contact` / `Account` records.
6. **`inventoryService.js`**: Validates stock levels against Salesforce ERP quantities.

---

## 10. Development & Production Guidelines

- **No Secrets in Client**: Never add Salesforce credentials to `frontend/.env` or any client-side bundle.
- **Layered Code**: Keep business logic inside service classes, not in controllers or React components.
- **Safe Governor Limits**: Salesforce queries in future phases must use bulk-safe SOQL/REST strategies.
#   C l i e n t 1 - B h a s k a r a - R e a d y m a d e s -  
 