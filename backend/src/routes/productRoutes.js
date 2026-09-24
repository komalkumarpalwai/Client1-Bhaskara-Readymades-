import { Router } from 'express';
import { productController } from '../controllers/productController.js';

const router = Router();

router.get('/', productController.getProducts);
router.get('/image/:versionId', productController.getImage);
router.get('/search', productController.searchProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:productId', productController.getProductById);

export default router;
