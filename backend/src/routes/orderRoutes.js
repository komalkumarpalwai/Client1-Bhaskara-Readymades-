import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Public Checkout / Buy Now Order Creation (Generates Salesforce Order & OrderItems)
router.post('/', orderController.createOrder);

// Protected Admin Order Management
router.get('/', authMiddleware, orderController.getOrders);
router.get('/:orderId', authMiddleware, orderController.getOrderById);

export default router;

