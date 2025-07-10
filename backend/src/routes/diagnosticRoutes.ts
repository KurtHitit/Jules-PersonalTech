// backend/src/routes/diagnosticRoutes.ts
import express, { Router } from 'express';
import * as diagnosticController from '../controllers/diagnosticController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

// All diagnostic routes are protected
router.use(protect);

// @route   POST /api/diagnostics
// @desc    Get diagnostic suggestions for an item
// @access  Private
router.post('/', diagnosticController.getDiagnosticSuggestions);

// @route   POST /api/diagnostics/feedback
// @desc    Submit feedback for diagnostic suggestions
// @access  Private
router.post('/feedback', diagnosticController.submitDiagnosticFeedback);

export default router;
