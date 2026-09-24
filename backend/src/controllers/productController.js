import { productService } from '../services/productService.js';
import { sendSuccess } from '../utils/response.js';

export const productController = {
  getProducts: async (req, res, next) => {
    try {
      const products = await productService.getAllProducts(req.query);
      return sendSuccess(res, 200, 'Products API is ready', {
        products,
        total: products.length
      });
    } catch (err) {
      next(err);
    }
  },

  getProductById: async (req, res, next) => {
    try {
      const { productId } = req.params;
      const product = await productService.getProductById(productId);
      return sendSuccess(res, 200, `Product details for ${productId}`, { product });
    } catch (err) {
      next(err);
    }
  },

  searchProducts: async (req, res, next) => {
    try {
      const query = req.query.q || '';
      const results = await productService.searchProducts(query);
      return sendSuccess(res, 200, 'Product search API is ready', {
        query,
        results
      });
    } catch (err) {
      next(err);
    }
  },

  getImage: async (req, res, next) => {
    try {
      const { versionId } = req.params;
      const { buffer, contentType } = await productService.getImageBuffer(versionId);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(buffer);
    } catch (err) {
      return res.status(404).json({ success: false, message: 'Image not found in Salesforce' });
    }
  },

  getProductsByCategory: async (req, res, next) => {
    try {
      const { category } = req.params;
      const products = await productService.getProductsByCategory(category);
      return sendSuccess(res, 200, `Products for category: ${category}`, {
        category,
        products
      });
    } catch (err) {
      next(err);
    }
  }
};
