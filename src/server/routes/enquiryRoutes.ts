/**
 * Enquiry Routes
 */
import { Router } from 'express';
import {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from '../controllers/enquiryController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

// Public / client creation of enquiry
router.post('/', createEnquiry);

// Protected routes
router.get('/', authenticateJWT, getEnquiries);
router.put('/:id/status', authenticateJWT, authorizeRoles('admin', 'agent'), updateEnquiryStatus);
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), deleteEnquiry);

export default router;
