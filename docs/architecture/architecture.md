# System Architecture Documentation

## 1. High-Level Architecture

The platform is designed as a decoupled, multi-tier full-stack e-commerce solution for Bhaskara Readymades (Men's, Women's, and Kids' readymade garments). Salesforce operates as the central System of Record (SoR) for inventory, product catalogues, and order fulfillment.

```text
+-------------------------------------------------------------+
|                     Client Browser                         |
|  React 18 + Vite + Tailwind CSS + React Router DOM          |
+------------------------------+------------------------------+
                               |
                               | HTTPS REST API (JSON)
                               v
+-------------------------------------------------------------+
|               Node.js + Express REST API Gateway           |
|                                                             |
|  Routes  -->  Controllers  -->  Services  -->  SF Services  |
|                                                             |
|  - Token & Auth Guard                                       |
|  - Request Validation & Error Handling                      |
|  - Data Transformation & Sanitization                       |
|  - Cache Layer (Future Redis / Memory)                      |
+------------------------------+------------------------------+
                               |
                               | Salesforce Connected App
                               | OAuth 2.0 / REST / SOQL
                               v
+-------------------------------------------------------------+
|                     Salesforce Org                          |
|                                                             |
|  - Product2 & PricebookEntry (Garment Catalogue & Pricing)  |
|  - Order & OrderItem (E-commerce Transactions)              |
|  - Contact & Account (Customer Management)                  |
|  - Inventory & Stock Balances (ERP Tracking)                |
+-------------------------------------------------------------+
```

## 2. Security Boundaries

1. **Frontend Isolation**:
   - The React frontend NEVER connects directly to Salesforce.
   - All interactions route strictly through the Express backend proxy.
   - `SALESFORCE_CLIENT_SECRET`, `SALESFORCE_PASSWORD`, and security tokens exist solely within backend environment variables and are never bundled into the client build.

2. **Backend Authentication & Authorization**:
   - Customer and admin routes are separated.
   - Middleware handles route authorization (`authMiddleware`, `adminMiddleware`).

3. **Rate Limiting & Gateway Shield**:
   - Express shields the Salesforce API from high-concurrency client requests and burst limits via future rate-limiting and caching layers.

## 3. Directory & Monorepo Separation

- `frontend/`: Standalone Vite project for UI presentation, client routing, and state.
- `backend/`: Standalone Express project with layered service architecture.
- `docs/`: System documentation, API contracts, and integration specifications.
