/**
 * Visit Scheduling Routes
 */
import { Router } from 'express';
import {
  scheduleVisit,
  getVisits,
  updateVisit,
  cancelVisit,
} from '../controllers/visitController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateJWT);

router.post('/', scheduleVisit);
router.get('/', getVisits);
router.put('/:id', updateVisit);
router.put('/:id/cancel', cancelVisit);

export default router;
