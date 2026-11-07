/**
 * Analytics and Summary Dashboard Routes
 */
import { Router } from 'express';
import { getDashboardAnalytics } from '../controllers/reportController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticateJWT);
router.get('/dashboard', authorizeRoles('admin', 'agent'), getDashboardAnalytics);

export default router;
