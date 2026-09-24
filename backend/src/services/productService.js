import { sfProductService } from './salesforce/productService.js';
import { logger } from '../utils/logger.js';

export const productService = {
  async getAllProducts(query = {}) {
    return await sfProductService.fetchProducts(query);
  },

  async getProductById(productId) {
    return await sfProductService.fetchProductById(productId);
  },

  async createProduct(productData) {
    return await sfProductService.createProduct(productData);
  },

  async updateProduct(productId, productData) {
    return await sfProductService.updateProduct(productId, productData);
  },

  async deleteProduct(productId) {
    return await sfProductService.deleteProduct(productId);
  },

  async searchProducts(searchTerm) {
    const all = await sfProductService.fetchProducts();
    if (!searchTerm) return all;
    const lower = searchTerm.toLowerCase();
    return all.filter(p => 
      p.name?.toLowerCase().includes(lower) || 
      p.category?.toLowerCase().includes(lower) ||
      p.code?.toLowerCase().includes(lower)
    );
  },

  async getImageBuffer(versionId) {
    return await sfProductService.fetchImageBuffer(versionId);
  },

  async getProductsByCategory(category) {
    return await sfProductService.fetchProductsByCategory(category);
  }
};
