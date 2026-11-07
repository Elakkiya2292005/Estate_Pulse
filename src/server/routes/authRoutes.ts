/**
 * Authentication Routes
 */
import { Router } from 'express';
import { register, login, getMe, getDemoUsers } from '../controllers/authController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateJWT, getMe);
router.get('/demo-users', getDemoUsers);

export default router;
