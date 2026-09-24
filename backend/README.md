# Readymades E-Commerce Backend API

Node.js and Express REST API service with layered architecture designed to interface with Salesforce as the core business engine.

## Architectural Layers

```text
HTTP Request
     ↓
Route (backend/src/routes/)
     ↓
Controller (backend/src/controllers/)
     ↓
Service (backend/src/services/)
     ↓
Salesforce Service (backend/src/services/salesforce/)
     ↓
Salesforce Client (OAuth / REST / SOQL)
     ↓
Salesforce Org
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```

Server will run on `http://localhost:5000` by default.

## API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api` | Service health status |
| GET | `/api/products` | Retrieve garment catalogue |
| GET | `/api/products/:productId` | Product details |
| GET | `/api/products/search?q=` | Search products |
| GET | `/api/products/category/:category` | Category filter (men, women, kids) |
| POST | `/api/auth/login` | Customer/Admin authentication |
| POST | `/api/auth/register` | Customer registration |
| GET | `/api/cart` | Active customer/guest cart |
| POST | `/api/cart/items` | Add item to cart |
| PUT | `/api/cart/items/:itemId` | Update cart item quantity |
| DELETE | `/api/cart/items/:itemId` | Remove item from cart |
| POST | `/api/orders` | Create e-commerce order |
| GET | `/api/orders/:orderId` | Retrieve order status |
| GET | `/api/admin/products` | Admin product management |
| GET | `/api/admin/orders` | Admin order review |
| GET | `/api/admin/customers` | Admin customer list |
