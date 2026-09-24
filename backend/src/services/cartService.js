import { logger } from '../utils/logger.js';

export const cartService = {
  async getCart(userId) {
    logger.debug(`Fetching cart for user: ${userId}`);
    return {
      userId,
      items: [],
      totalAmount: 0
    };
  },

  async addToCart(userId, item) {
    logger.debug(`Adding item to cart for user ${userId}`, { item });
    return {
      userId,
      items: [item],
      totalAmount: (item.price || 0) * (item.quantity || 1)
    };
  },

  async updateCartItem(userId, itemId, quantity) {
    logger.debug(`Updating item ${itemId} quantity to ${quantity} for user ${userId}`);
    return {
      userId,
      updatedItemId: itemId,
      quantity
    };
  },

  async removeFromCart(userId, itemId) {
    logger.debug(`Removing item ${itemId} from cart for user ${userId}`);
    return {
      userId,
      removedItemId: itemId
    };
  },

  async clearCart(userId) {
    logger.debug(`Clearing cart for user ${userId}`);
    return {
      userId,
      items: []
    };
  }
};
