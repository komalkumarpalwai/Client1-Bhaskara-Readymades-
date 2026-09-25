import { salesforceClient } from './salesforceClient.js';
import { logger } from '../../utils/logger.js';

/**
 * Salesforce Product Service
 * Fetches Product2 records where Is_Custom_Product__c = TRUE or IsActive = TRUE
 */
export const sfProductService = {
  /**
   * Fetch custom clothing products from Salesforce Product2 with image attachments
   */
  async fetchProducts(filters = {}) {
    try {
      const soql = `
        SELECT Id, Name, ProductCode, Description, Family, StockKeepingUnit, 
               Is_Custom_Product__c, Product_Price__c, IsActive, CreatedDate
        FROM Product2 
        WHERE Is_Custom_Product__c = true
        ORDER BY CreatedDate DESC
      `;
      
      const result = await salesforceClient.query(soql);
      const productRecords = result.records || [];

      // Query all attached images/files from ContentDocumentLink for these products
      let imagesByProduct = {};
      try {
        const imageSoql = `
          SELECT Id, LinkedEntityId, ContentDocumentId, ContentDocument.LatestPublishedVersionId, 
                 ContentDocument.Title, ContentDocument.FileType, ContentDocument.FileExtension,
                 ContentDocument.CreatedDate
          FROM ContentDocumentLink 
          WHERE LinkedEntityId IN (SELECT Id FROM Product2 WHERE Is_Custom_Product__c = true)
        `;
        const imageResult = await salesforceClient.query(imageSoql);
        (imageResult.records || []).forEach((link) => {
          const versionId = link.ContentDocument?.LatestPublishedVersionId;
          if (versionId) {
            if (!imagesByProduct[link.LinkedEntityId]) {
              imagesByProduct[link.LinkedEntityId] = [];
            }
            imagesByProduct[link.LinkedEntityId].push({
              versionId: versionId,
              title: link.ContentDocument?.Title || 'Product Image',
              extension: link.ContentDocument?.FileExtension || 'jpg',
              url: `/api/products/image/${versionId}`,
              createdDate: link.ContentDocument?.CreatedDate || ''
            });
          }
        });

        // Sort images for each product by createdDate DESC (latest first)
        Object.keys(imagesByProduct).forEach((prodId) => {
          imagesByProduct[prodId].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        });
      } catch (imgErr) {
        logger.warn('Could not load product image attachments:', { message: imgErr.message });
      }

      const formatted = productRecords.map((sfRec) => {
        const productImages = imagesByProduct[sfRec.Id] || [];
        const latestImg = productImages[0];
        return {
          id: sfRec.Id,
          name: sfRec.Name,
          code: sfRec.ProductCode || sfRec.StockKeepingUnit || sfRec.Id.slice(-6),
          sku: sfRec.StockKeepingUnit,
          description: sfRec.Description || '',
          category: sfRec.Family || 'General',
          price: sfRec.Product_Price__c != null ? `₹${sfRec.Product_Price__c}` : '₹0',
          numericPrice: sfRec.Product_Price__c || 0,
          isCustom: sfRec.Is_Custom_Product__c,
          isActive: sfRec.IsActive,
          createdDate: sfRec.CreatedDate,
          imageUrl: latestImg ? latestImg.url : null,
          images: productImages.map((img) => img.url),
          imageDetails: productImages,
          hasImage: productImages.length > 0
        };
      });

      return formatted;
    } catch (error) {
      logger.error('Failed to query Product2 from Salesforce:', { error: error.message });
      return [];
    }
  },

  /**
   * Fetch image binary buffer directly from Salesforce ContentVersion
   */
  async fetchImageBuffer(versionId) {
    try {
      const auth = await salesforceClient.salesforceAuth ? await salesforceClient.salesforceAuth.getAccessToken() : null;
      // Use standard auth flow
      const { salesforceAuth } = await import('./salesforceAuth.js');
      const authTokens = await salesforceAuth.getAccessToken();
      const endpoint = `${authTokens.instanceUrl}/services/data/v59.0/sobjects/ContentVersion/${versionId}/VersionData`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authTokens.accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const arrayBuffer = await response.arrayBuffer();
      return {
        buffer: Buffer.from(arrayBuffer),
        contentType
      };
    } catch (error) {
      logger.error('Error fetching image from Salesforce:', { versionId, error: error.message });
      throw error;
    }
  },

  async getImageBuffer(versionId) {
    return this.fetchImageBuffer(versionId);
  },

  /**
   * Upload a photo as ContentVersion attached to a Product2 record
   */
  async uploadProductPhoto(productId, photo) {
    try {
      // photo: { title, filename, base64Data, contentType }
      const cleanBase64 = photo.base64Data.includes('base64,') 
        ? photo.base64Data.split('base64,')[1] 
        : photo.base64Data;

      const payload = {
        Title: photo.title || photo.filename || `Product Photo - ${productId}`,
        PathOnClient: photo.filename || 'product-image.jpg',
        VersionData: cleanBase64,
        FirstPublishLocationId: productId
      };

      const result = await salesforceClient.createRecord('ContentVersion', payload);
      logger.info('Uploaded product photo to Salesforce ContentVersion:', { productId, versionId: result.id });
      return result;
    } catch (error) {
      logger.error('Failed to upload photo to Salesforce:', { productId, error: error.message });
      throw error;
    }
  },

  /**
   * Delete an attached photo (ContentDocument) by ContentDocumentId or versionId
   */
  async deleteProductPhoto(docOrVersionId) {
    try {
      let docId = docOrVersionId;
      // If it's a versionId (prefix 068), query its ContentDocumentId (prefix 069)
      if (docOrVersionId.startsWith('068')) {
        const queryRes = await salesforceClient.query(
          `SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id = '${docOrVersionId}'`
        );
        docId = queryRes.records?.[0]?.ContentDocumentId;
      }

      if (!docId) {
        throw new Error(`ContentDocument not found for ID: ${docOrVersionId}`);
      }

      const result = await salesforceClient.deleteRecord('ContentDocument', docId);
      logger.info('Deleted attached photo from Salesforce ContentDocument:', { docId });
      return result;
    } catch (error) {
      logger.error('Failed to delete photo from Salesforce:', { error: error.message });
      throw error;
    }
  },

  /**
   * Create custom clothing product in Salesforce Product2 with optional attached photos
   */
  async createProduct(productData) {
    try {
      const payload = {
        Name: productData.name,
        ProductCode: productData.code || productData.sku || '',
        StockKeepingUnit: productData.sku || productData.code || '',
        Family: productData.category || productData.family || 'Shirts',
        Description: productData.description || '',
        Product_Price__c: parseFloat(productData.price || productData.numericPrice || 0),
        Is_Custom_Product__c: true,
        IsActive: productData.isActive !== false
      };
      
      const result = await salesforceClient.createRecord('Product2', payload);
      logger.info('Salesforce Product2 created successfully:', result);

      const productId = result.id;

      // Upload any photos provided in the payload
      if (productData.photos && Array.isArray(productData.photos) && productData.photos.length > 0) {
        for (const photo of productData.photos) {
          if (photo.base64Data) {
            try {
              await this.uploadProductPhoto(productId, photo);
            } catch (pErr) {
              logger.warn('Error uploading photo during product creation:', { message: pErr.message });
            }
          }
        }
      }

      return result;
    } catch (error) {
      logger.error('Failed to create Product2 in Salesforce:', { error: error.message });
      throw error;
    }
  },

  /**
   * Fetch single product by ID with full fields and all attached images
   */
  async fetchProductById(productId) {
    try {
      const soql = `
        SELECT Id, Name, ProductCode, Description, Family, StockKeepingUnit, 
               Is_Custom_Product__c, Product_Price__c, IsActive, CreatedDate, 
               LastModifiedDate, CreatedById, LastModifiedById
        FROM Product2 
        WHERE Id = '${productId}'
      `;
      const result = await salesforceClient.query(soql);
      const sfRec = result.records?.[0];
      if (!sfRec) return null;

      // Query attached images for this product
      let productImages = [];
      try {
        const imageSoql = `
          SELECT Id, LinkedEntityId, ContentDocumentId, ContentDocument.LatestPublishedVersionId, 
                 ContentDocument.Title, ContentDocument.FileType, ContentDocument.FileExtension,
                 ContentDocument.CreatedDate
          FROM ContentDocumentLink 
          WHERE LinkedEntityId = '${productId}'
        `;
        const imageResult = await salesforceClient.query(imageSoql);
        (imageResult.records || []).forEach((link) => {
          const versionId = link.ContentDocument?.LatestPublishedVersionId;
          if (versionId) {
            productImages.push({
              documentId: link.ContentDocumentId,
              versionId: versionId,
              title: link.ContentDocument?.Title || 'Product Image',
              extension: link.ContentDocument?.FileExtension || 'jpg',
              url: `/api/products/image/${versionId}`,
              createdDate: link.ContentDocument?.CreatedDate || ''
            });
          }
        });

        // Sort latest first
        productImages.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      } catch (imgErr) {
        logger.warn('Could not load single product image attachments:', { message: imgErr.message });
      }

      const latestImg = productImages[0];

      return {
        id: sfRec.Id,
        name: sfRec.Name,
        code: sfRec.ProductCode || sfRec.StockKeepingUnit || '',
        sku: sfRec.StockKeepingUnit || '',
        description: sfRec.Description || '',
        category: sfRec.Family || 'General',
        price: sfRec.Product_Price__c != null ? `₹${sfRec.Product_Price__c}` : '₹0',
        numericPrice: sfRec.Product_Price__c || 0,
        isCustom: sfRec.Is_Custom_Product__c,
        isActive: sfRec.IsActive,
        createdDate: sfRec.CreatedDate,
        lastModifiedDate: sfRec.LastModifiedDate,
        createdById: sfRec.CreatedById,
        lastModifiedById: sfRec.LastModifiedById,
        imageUrl: latestImg ? latestImg.url : null,
        images: productImages.map((img) => img.url),
        imageDetails: productImages,
        hasImage: productImages.length > 0
      };
    } catch (error) {
      logger.error('Failed to query Product2 by ID:', { error: error.message });
      return null;
    }
  },

  /**
   * Update custom product in Salesforce Product2 with photo attachments and deletions
   */
  async updateProduct(productId, productData) {
    try {
      const payload = {};
      if (productData.name !== undefined) payload.Name = productData.name;
      if (productData.code !== undefined) payload.ProductCode = productData.code;
      if (productData.sku !== undefined) payload.StockKeepingUnit = productData.sku;
      if (productData.category !== undefined || productData.family !== undefined) {
        payload.Family = productData.category || productData.family;
      }
      if (productData.description !== undefined) payload.Description = productData.description;
      if (productData.price !== undefined || productData.numericPrice !== undefined) {
        payload.Product_Price__c = parseFloat(productData.price || productData.numericPrice || 0);
      }
      if (productData.isActive !== undefined) payload.IsActive = Boolean(productData.isActive);

      let result = { success: true };
      if (Object.keys(payload).length > 0) {
        result = await salesforceClient.updateRecord('Product2', productId, payload);
        logger.info('Salesforce Product2 updated successfully:', { productId, result });
      }

      // Delete any photo document IDs requested for removal
      if (productData.deletePhotos && Array.isArray(productData.deletePhotos) && productData.deletePhotos.length > 0) {
        for (const photoId of productData.deletePhotos) {
          try {
            await this.deleteProductPhoto(photoId);
          } catch (delErr) {
            logger.warn('Error deleting photo during product update:', { photoId, message: delErr.message });
          }
        }
      }

      // Upload any new photos attached in the update payload
      if (productData.newPhotos && Array.isArray(productData.newPhotos) && productData.newPhotos.length > 0) {
        for (const photo of productData.newPhotos) {
          if (photo.base64Data) {
            try {
              await this.uploadProductPhoto(productId, photo);
            } catch (upErr) {
              logger.warn('Error uploading new photo during product update:', { message: upErr.message });
            }
          }
        }
      }

      return result;
    } catch (error) {
      logger.error('Failed to update Product2 in Salesforce:', { error: error.message, productId });
      throw error;
    }
  },

  /**
   * Delete custom product from Salesforce Product2
   */
  async deleteProduct(productId) {
    try {
      const result = await salesforceClient.deleteRecord('Product2', productId);
      logger.info('Salesforce Product2 deleted successfully:', { productId });
      return result;
    } catch (error) {
      logger.error('Failed to delete Product2 in Salesforce:', { error: error.message, productId });
      throw error;
    }
  },

  /**
   * Fetch products by category
   */
  async fetchProductsByCategory(category) {
    try {
      const soql = `
        SELECT Id, Name, ProductCode, Description, Family, StockKeepingUnit, 
               Is_Custom_Product__c, Product_Price__c, IsActive 
        FROM Product2 
        WHERE Is_Custom_Product__c = true AND Family = '${category}'
      `;
      const result = await salesforceClient.query(soql);
      return result.records || [];
    } catch (error) {
      logger.error('Failed to query Product2 by category:', { error: error.message });
      return [];
    }
  }
};
