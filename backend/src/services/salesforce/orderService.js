import { salesforceClient } from './salesforceClient.js';
import { logger } from '../../utils/logger.js';

/**
 * Salesforce Order Service
 * Queries Order records from Salesforce
 */
export const sfOrderService = {
  /**
   * Fetch Orders from Salesforce Order standard object
   */
  async fetchOrders() {
    try {
      const soql = `
        SELECT Id, OrderNumber, Account.Name, EffectiveDate, Status, TotalAmount, CreatedDate 
        FROM Order 
        ORDER BY CreatedDate DESC 
        LIMIT 100
      `;
      const result = await salesforceClient.query(soql);
      
      return (result.records || []).map((o) => ({
        id: o.OrderNumber ? `ORD-${o.OrderNumber}` : o.Id,
        sfId: o.Id,
        customer: o.Account?.Name || 'Retail Customer',
        phone: '-',
        items: 'Clothing Order',
        amount: o.TotalAmount ? `₹${o.TotalAmount}` : '₹0',
        date: new Date(o.EffectiveDate || o.CreatedDate).toLocaleDateString('en-IN'),
        status: o.Status || 'CONFIRMED'
      }));
    } catch (error) {
      logger.error('Failed to query Orders from Salesforce:', { error: error.message });
      return [];
    }
  },

  /**
   * Fetch single Order by ID with line items (OrderItems)
   */
  async fetchOrderById(orderId) {
    try {
      const soql = `
        SELECT Id, OrderNumber, Account.Name, Account.Phone, Account.BillingAddress, 
               EffectiveDate, Status, TotalAmount, Type, Description, 
               CreatedDate, LastModifiedDate,
               (SELECT Id, Product2.Name, Product2.ProductCode, Quantity, UnitPrice, TotalPrice, Description FROM OrderItems)
        FROM Order 
        WHERE Id = '${orderId}' OR OrderNumber = '${orderId.replace(/^ORD-/, '')}'
      `;
      const result = await salesforceClient.query(soql);
      const o = result.records?.[0];
      if (!o) return null;

      const orderItems = (o.OrderItems?.records || []).map(item => ({
        id: item.Id,
        productName: item.Product2?.Name || 'Item',
        productCode: item.Product2?.ProductCode || '-',
        quantity: item.Quantity || 1,
        unitPrice: item.UnitPrice != null ? `₹${item.UnitPrice}` : '₹0',
        totalPrice: item.TotalPrice != null ? `₹${item.TotalPrice}` : '₹0',
        description: item.Description || ''
      }));

      return {
        id: o.OrderNumber ? `ORD-${o.OrderNumber}` : o.Id,
        sfId: o.Id,
        customer: o.Account?.Name || 'Retail Customer',
        phone: o.Account?.Phone || '-',
        effectiveDate: o.EffectiveDate,
        date: new Date(o.EffectiveDate || o.CreatedDate).toLocaleDateString('en-IN'),
        createdDate: o.CreatedDate,
        lastModifiedDate: o.LastModifiedDate,
        status: o.Status || 'CONFIRMED',
        totalAmount: o.TotalAmount != null ? `₹${o.TotalAmount}` : '₹0',
        type: o.Type || 'Standard',
        description: o.Description || '',
        items: orderItems
      };
    } catch (error) {
      logger.error('Failed to query Order by ID:', { error: error.message });
      return null;
    }
  },

  /**
   * Create an Order in Salesforce with OrderItems
   * AccountId: 001g800000t5zb3AAA
   * Fields: Website_Customer_Name__c, Website_Customer_Email__c, Website_Customer_Phone__c, 
   *         ShippingStreet, ShippingCity, ShippingState, ShippingPostalCode, Status, EffectiveDate
   */
  async createSalesforceOrder(orderData) {
    try {
      const HARDCODED_ACCOUNT_ID = '001g800000t5zb3AAA';

      // 1. Determine or query Standard Pricebook
      let pricebook2Id = null;
      try {
        const pbRes = await salesforceClient.query("SELECT Id FROM Pricebook2 WHERE IsStandard = true LIMIT 1");
        if (pbRes.records && pbRes.records.length > 0) {
          pricebook2Id = pbRes.records[0].Id;
        }
      } catch (pbErr) {
        logger.warn('Could not query Standard Pricebook:', { error: pbErr.message });
      }

      // 2. Format Order Header
      const effectiveDate = new Date().toISOString().split('T')[0];
      const customerName = `${orderData.firstName || ''} ${orderData.lastName || ''}`.trim() || orderData.name || 'Website Customer';
      
      const orderPayload = {
        AccountId: HARDCODED_ACCOUNT_ID,
        Status: 'Draft',
        EffectiveDate: effectiveDate,
        Website_Customer_Name__c: customerName,
        Website_Customer_Email__c: orderData.email || '',
        Website_Customer_Phone__c: orderData.phone || '',
        ShippingStreet: orderData.shippingAddress || orderData.street || '',
        ShippingCity: orderData.city || 'Ganapavaram',
        ShippingState: orderData.state || 'Andhra Pradesh',
        ShippingPostalCode: orderData.postalCode || orderData.pincode || '534198',
        ShippingCountry: 'India',
        Description: orderData.notes || `Storefront Order for ${customerName}. Items count: ${(orderData.items || []).length}`
      };

      if (pricebook2Id) {
        orderPayload.Pricebook2Id = pricebook2Id;
      }

      logger.info('Creating Salesforce Order:', { orderPayload });
      const orderResult = await salesforceClient.createRecord('Order', orderPayload);
      const createdOrderId = orderResult.id;

      // 3. Create OrderItems if items are provided
      const items = orderData.items || [];
      if (items.length > 0 && pricebook2Id) {
        for (const item of items) {
          try {
            const prodSfId = item.sfId || item.id;
            // Lookup PricebookEntry for this product
            let pbeId = null;
            const pbeRes = await salesforceClient.query(`
              SELECT Id, UnitPrice 
              FROM PricebookEntry 
              WHERE Pricebook2Id = '${pricebook2Id}' 
                AND Product2Id = '${prodSfId}' 
                AND IsActive = true 
              LIMIT 1
            `);

            if (pbeRes.records && pbeRes.records.length > 0) {
              pbeId = pbeRes.records[0].Id;
            } else {
              // Create standard PricebookEntry if not found
              const unitPrice = parseFloat(item.numericPrice || item.price || 0) || 100;
              try {
                const newPbe = await salesforceClient.createRecord('PricebookEntry', {
                  Pricebook2Id: pricebook2Id,
                  Product2Id: prodSfId,
                  UnitPrice: unitPrice,
                  IsActive: true
                });
                pbeId = newPbe.id;
              } catch (createPbeErr) {
                logger.warn('Could not create PricebookEntry on the fly:', { error: createPbeErr.message });
              }
            }

            if (pbeId) {
              const unitPrice = parseFloat(item.numericPrice || item.price || 0) || 100;
              const qty = parseInt(item.quantity, 10) || 1;
              await salesforceClient.createRecord('OrderItem', {
                OrderId: createdOrderId,
                PricebookEntryId: pbeId,
                Quantity: qty,
                UnitPrice: unitPrice,
                Description: `Size: ${item.selectedSize || 'Free Size'}`
              });
            }
          } catch (itemErr) {
            logger.warn('Error adding OrderItem to Salesforce Order:', { error: itemErr.message });
          }
        }
      }

      // Fetch created order details
      const createdDetails = await this.fetchOrderById(createdOrderId);
      return createdDetails || { id: createdOrderId, sfId: createdOrderId, status: 'Draft' };
    } catch (error) {
      logger.error('Failed to create Salesforce Order:', { error: error.message });
      throw error;
    }
  }
};

