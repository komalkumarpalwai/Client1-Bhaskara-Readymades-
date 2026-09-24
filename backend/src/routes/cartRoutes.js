import { Router } from 'express';
import { cartController } from '../controllers/cartController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Routes support both guest and authenticated customer carts
router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items/:itemId', cartController.updateItem);
router.delete('/items/:itemId', cartController.removeItem);
router.delete('/', cartController.clearCart);

export default router;
