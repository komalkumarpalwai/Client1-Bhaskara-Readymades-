# Salesforce Integration Architecture & Strategy

## 1. Overview

The backend acts as an authenticated proxy and caching layer between the client-facing e-commerce storefront and the client's Salesforce Org.

Salesforce is used as the single source of truth for:
- Garment Catalog (`Product2`, `Pricebook2`, `PricebookEntry`)
- Inventory Levels & Variants (`Inventory__c` / Custom Stock Balance)
- Customer Accounts & Contacts (`Account`, `Contact`)
- Sales Orders & Line Items (`Order`, `OrderItem`)

---

## 2. Authentication Flow

Salesforce communicates via OAuth 2.0 using a Connected App configured in the Salesforce Org.

### Recommended Grant Types:
1. **OAuth 2.0 JWT Bearer Flow (Production Recommended)**:
   - Certificate-based authentication without storing passwords.
   - Ideal for server-to-server daemon processes.
2. **OAuth 2.0 Username-Password Flow (Development / Sandbox Testing)**:
   - Requires `SALESFORCE_CLIENT_ID`, `SALESFORCE_CLIENT_SECRET`, `SALESFORCE_USERNAME`, `SALESFORCE_PASSWORD`, and `SALESFORCE_SECURITY_TOKEN`.

### Token Management:
- The backend (`salesforceAuth.js`) automatically refreshes tokens and caches them in memory.
- Requests automatically retry once if a `401 Unauthorized` token expiry occurs.

---

## 3. Data Mapping & Schema Preparation

### Products (Garments)
| Salesforce Field / Object | E-commerce Domain | Description |
|---|---|---|
| `Product2.Id` | `productId` | Unique Salesforce record identifier |
| `Product2.Name` | `name` | Garment title |
| `Product2.ProductCode` | `sku` | Stock Keeping Unit |
| `Product2.Family` | `category` | Men, Women, Kids |
| `Product2.Description` | `description` | Product details and fabric info |
| `Product2.IsActive` | `isActive` | Active flag |
| `PricebookEntry.UnitPrice` | `price` | Selling price |
| `Product2.Gender__c` *(Planned)* | `gender` | Target audience (Men, Women, Kids, Unisex) |
| `Product2.Sizes__c` *(Planned)* | `sizes` | Available sizes (e.g., S, M, L, XL, XXL, 32, 34, 36) |
| `Product2.Colors__c` *(Planned)* | `colors` | Available color options |

### Orders & Checkout
| Salesforce Field / Object | E-commerce Domain | Description |
|---|---|---|
| `Order.AccountId` | `customerId` | Salesforce Account / Customer reference |
| `Order.EffectiveDate` | `orderDate` | Date order placed |
| `Order.Status` | `status` | PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED |
| `Order.TotalAmount` | `totalAmount` | Order monetary total |
| `OrderItem.PricebookEntryId` | `pricebookEntryId` | Pricebook link |
| `OrderItem.Quantity` | `quantity` | Quantity purchased |
| `OrderItem.UnitPrice` | `unitPrice` | Price per item |

---

## 4. Security Rules
- **No Direct Frontend Access**: Frontend NEVER receives Salesforce credentials or endpoints.
- **Environment Variables**: Only the Node.js backend accesses Salesforce credentials.
- **Error Obfuscation**: Internal Salesforce errors (e.g., SOQL limits, schema validations) are caught, sanitized, and logged on the server. The client receives a clean generic JSON error.
