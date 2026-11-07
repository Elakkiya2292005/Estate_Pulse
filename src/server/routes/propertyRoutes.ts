/**
 * Property Routes
 */
import { Router } from 'express';
import {
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

// Public routes
router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/:id', getPropertyById);

// Protected routes (Admin & Agent create/update, Admin delete)
router.post('/', authenticateJWT, authorizeRoles('admin', 'agent'), createProperty);
router.put('/:id', authenticateJWT, authorizeRoles('admin', 'agent'), updateProperty);
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), deleteProperty);

export default router;
