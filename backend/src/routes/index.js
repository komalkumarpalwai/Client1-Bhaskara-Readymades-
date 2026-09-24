import { Router } from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import cartRoutes from './cartRoutes.js';
import orderRoutes from './orderRoutes.js';
import customerRoutes from './customerRoutes.js';
import adminRoutes from './adminRoutes.js';
import { sendSuccess } from '../utils/response.js';

const apiRouter = Router();

// API Health / Root info
apiRouter.get('/', (req, res) => {
  return sendSuccess(res, 200, 'Readymades E-commerce API is running', {
    version: '1.0.0',
    status: 'healthy'
  });
});

// Domain sub-routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/cart', cartRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/customers', customerRoutes);
apiRouter.use('/admin', adminRoutes);

export default apiRouter;
