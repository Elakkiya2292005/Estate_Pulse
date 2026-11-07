/**
 * Deal Pipeline Routes
 */
import { Router } from 'express';
import {
  createDeal,
  getDeals,
  updateDealStage,
  deleteDeal,
} from '../controllers/dealController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticateJWT);

router.get('/', getDeals);
router.post('/', authorizeRoles('admin', 'agent'), createDeal);
router.put('/:id', authorizeRoles('admin', 'agent'), updateDealStage);
router.delete('/:id', authorizeRoles('admin'), deleteDeal);

export default router;
