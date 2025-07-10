// backend/src/routes/serviceHistoryRoutes.ts
import express, { Router } from 'express';
import * as serviceHistoryController from '../controllers/serviceHistoryController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router({ mergeParams: true }); // mergeParams to access itemId from parent router

// All service history routes are protected
router.use(protect);

// @route   POST /api/items/:itemId/history
// @desc    Create a new service history entry for an item
// @access  Private
router.post('/', serviceHistoryController.createServiceHistory);

// @route   GET /api/items/:itemId/history
// @desc    Get all service history entries for a specific item
// @access  Private
router.get('/', serviceHistoryController.getServiceHistory);

// @route   GET /api/items/:itemId/history/:entryId
// @desc    Get a single service history entry by ID for a specific item
// @access  Private
router.get('/:entryId', serviceHistoryController.getServiceHistoryEntryById);

// @route   PUT /api/items/:itemId/history/:entryId
// @desc    Update a service history entry for a specific item
// @access  Private
router.put('/:entryId', serviceHistoryController.updateServiceHistory);

// @route   DELETE /api/items/:itemId/history/:entryId
// @desc    Delete a service history entry for a specific item
// @access  Private
router.delete('/:entryId', serviceHistoryController.deleteServiceHistory);

export default router;
