import { cartService } from '../services/cartService.js';
import { sendSuccess } from '../utils/response.js';

export const cartController = {
  getCart: async (req, res, next) => {
    try {
      const userId = req.user?.id || 'anonymous';
      const cart = await cartService.getCart(userId);
      return sendSuccess(res, 200, 'Cart API is ready', { cart });
    } catch (err) {
      next(err);
    }
  },

  addItem: async (req, res, next) => {
    try {
      const userId = req.user?.id || 'anonymous';
      const result = await cartService.addToCart(userId, req.body);
      return sendSuccess(res, 201, 'Item added to cart', result);
    } catch (err) {
      next(err);
    }
  },

  updateItem: async (req, res, next) => {
    try {
      const userId = req.user?.id || 'anonymous';
      const { itemId } = req.params;
      const { quantity } = req.body;
      const result = await cartService.updateCartItem(userId, itemId, quantity);
      return sendSuccess(res, 200, 'Cart item updated', result);
    } catch (err) {
      next(err);
    }
  },

  removeItem: async (req, res, next) => {
    try {
      const userId = req.user?.id || 'anonymous';
      const { itemId } = req.params;
      const result = await cartService.removeFromCart(userId, itemId);
      return sendSuccess(res, 200, 'Cart item removed', result);
    } catch (err) {
      next(err);
    }
  },

  clearCart: async (req, res, next) => {
    try {
      const userId = req.user?.id || 'anonymous';
      const result = await cartService.clearCart(userId);
      return sendSuccess(res, 200, 'Cart cleared', result);
    } catch (err) {
      next(err);
    }
  }
};
