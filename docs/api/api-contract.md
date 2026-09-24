# REST API Contract Specification

All API endpoints are prefixed with `/api` and exchange data in `application/json`.

## 1. Response Standard Envelope

### Success Response
HTTP Status: `200 OK` or `201 Created`
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response
HTTP Status: `4xx` or `5xx`
```json
{
  "success": false,
  "message": "Human-readable error description",
  "error": {
    "details": null
  }
}
```

---

## 2. API Endpoints

### System / Health
- `GET /api`: Check health and API version.

### Product Catalogue
- `GET /api/products`: Retrieve all products (Supports filters: `category`, `page`, `limit`).
- `GET /api/products/:productId`: Retrieve single product details.
- `GET /api/products/search?q=`: Search products by keyword, code, or tag.
- `GET /api/products/category/:category`: Filter garments by category (`men`, `women`, `kids`).

### Authentication
- `POST /api/auth/login`: Authenticate user credentials.
- `POST /api/auth/register`: Create user account.
- `POST /api/auth/logout`: Invalidate session/token.
- `GET /api/auth/me`: Retrieve current authenticated profile.

### Shopping Cart
- `GET /api/cart`: Retrieve current user/guest cart.
- `POST /api/cart/items`: Add line item to cart.
- `PUT /api/cart/items/:itemId`: Update line item quantity.
- `DELETE /api/cart/items/:itemId`: Remove item from cart.
- `DELETE /api/cart`: Clear entire cart.

### Orders
- `POST /api/orders`: Submit new order.
- `GET /api/orders`: List orders for authenticated user.
- `GET /api/orders/:orderId`: Retrieve specific order details.

### Customers
- `GET /api/customers/profile`: Customer profile details.
- `PUT /api/customers/profile`: Update profile info.

### Admin Console
- `GET /api/admin/products`: List all inventory products.
- `POST /api/admin/products`: Create new product.
- `PUT /api/admin/products/:productId`: Update product metadata.
- `DELETE /api/admin/products/:productId`: Archive/delete product.
- `GET /api/admin/orders`: List all customer orders.
- `GET /api/admin/orders/:orderId`: Order details with audit trail.
- `PUT /api/admin/orders/:orderId/status`: Update order fulfillment status.
- `GET /api/admin/customers`: Query customer list.
