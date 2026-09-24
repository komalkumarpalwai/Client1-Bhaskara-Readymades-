import { Router } from 'express';
import { customerController } from '../controllers/customerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Public Lead / Contact Inquiries (Salesforce Lead Generation)
router.post('/lead', customerController.createLead);

// Protected Customer Profile Routes
router.use(authMiddleware);

router.get('/profile', customerController.getProfile);
router.put('/profile', customerController.updateProfile);

export default router;
