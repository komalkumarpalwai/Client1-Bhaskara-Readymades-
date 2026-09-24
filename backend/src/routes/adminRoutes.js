import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = Router();

// Protect all admin endpoints with adminMiddleware
router.use(adminMiddleware);

// Admin Product Routes
router.get('/products', adminController.getProducts);
router.get('/products/:productId', adminController.getProductById);
router.post('/products', adminController.createProduct);
router.put('/products/:productId', adminController.updateProduct);
router.delete('/products/:productId', adminController.deleteProduct);

// Admin Order Routes
router.get('/orders', adminController.getOrders);
router.get('/orders/:orderId', adminController.getOrderById);
router.put('/orders/:orderId/status', adminController.updateOrderStatus);

// Admin Customer Routes
router.get('/customers', adminController.getCustomers);
router.get('/customers/:customerId', adminController.getCustomerById);

export default router;
