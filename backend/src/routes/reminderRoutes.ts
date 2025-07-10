// backend/src/routes/reminderRoutes.ts
import express, { Router } from 'express';
import * as reminderController from '../controllers/reminderController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

// All reminder routes are protected
router.use(protect);

// @route   POST /api/reminders
// @desc    Create a new reminder
// @access  Private
router.post('/', reminderController.createReminder);

// @route   GET /api/reminders
// @desc    Get all reminders for the authenticated user
// @access  Private
router.get('/', reminderController.getReminders);

// @route   GET /api/reminders/:id
// @desc    Get a single reminder by its ID
// @access  Private
router.get('/:id', reminderController.getReminderById);

// @route   PUT /api/reminders/:id
// @desc    Update an existing reminder
// @access  Private
router.put('/:id', reminderController.updateReminder);

// @route   DELETE /api/reminders/:id
// @desc    Delete a reminder by its ID
// @access  Private
router.delete('/:id', reminderController.deleteReminder);

export default router;
