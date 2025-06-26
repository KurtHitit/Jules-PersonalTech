// backend/src/routes/authRoutes.ts
import express, { Router } from 'express';
import * as authController from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token (Login)
// @access  Public
router.post('/login', authController.loginUser);

// @route   GET api/auth/me
// @desc    Get current authenticated user's profile
// @access  Private
router.get('/me', protect, authController.getMe);

export default router;
