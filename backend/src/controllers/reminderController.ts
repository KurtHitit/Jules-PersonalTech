// backend/src/controllers/reminderController.ts
import { Request, Response } from 'express';
import * as reminderService from '../services/reminderService';

// @desc    Create a new reminder
// @route   POST /api/reminders
// @access  Private
export const createReminder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id; // User ID from auth middleware
    const reminderData = req.body; // Expects title, dueDate, notes, isRecurring, recurrencePattern, itemId

    const newReminder = await reminderService.createReminder(reminderData, userId);

    res.status(201).json({
      message: 'Reminder created successfully',
      reminder: newReminder,
    });
  } catch (error) {
    console.error('Error creating reminder:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error creating reminder', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error creating reminder', error: 'Unknown error' });
    }
  }
};

// @desc    Get all reminders for the authenticated user
// @route   GET /api/reminders
// @access  Private
export const getReminders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id; // User ID from auth middleware
    const reminders = await reminderService.getRemindersByUserId(userId);

    res.status(200).json({
      message: 'Reminders fetched successfully',
      reminders: reminders,
    });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error fetching reminders', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error fetching reminders', error: 'Unknown error' });
    }
  }
};

// @desc    Get a single reminder by ID
// @route   GET /api/reminders/:id
// @access  Private
export const getReminderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id; // User ID from auth middleware
    const reminderId = req.params.id;

    const reminder = await reminderService.getReminderById(reminderId, userId);

    if (reminder) {
      res.status(200).json({ message: 'Reminder fetched successfully', reminder: reminder });
    } else {
      res.status(404).json({ message: 'Reminder not found or not owned by user' });
    }
  } catch (error) {
    console.error(`Error fetching reminder ${req.params.id}:`, error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error fetching reminder', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error fetching reminder', error: 'Unknown error' });
    }
  }
};

// @desc    Update a reminder
// @route   PUT /api/reminders/:id
// @access  Private
export const updateReminder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id; // User ID from auth middleware
    const reminderId = req.params.id;
    const updates = req.body; // Expects partial reminder data

    const updatedReminder = await reminderService.updateReminder(reminderId, updates, userId);

    if (updatedReminder) {
      res.status(200).json({ message: 'Reminder updated successfully', reminder: updatedReminder });
    } else {
      res.status(404).json({ message: 'Reminder not found, cannot update, or not owned by user' });
    }
  } catch (error) {
    console.error(`Error updating reminder ${req.params.id}:`, error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error updating reminder', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error updating reminder', error: 'Unknown error' });
    }
  }
};

// @desc    Delete a reminder
// @route   DELETE /api/reminders/:id
// @access  Private
export const deleteReminder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id; // User ID from auth middleware
    const reminderId = req.params.id;

    const success = await reminderService.deleteReminder(reminderId, userId);

    if (success) {
      res.status(200).json({ message: 'Reminder deleted successfully' });
    } else {
      res.status(404).json({ message: 'Reminder not found or not owned by user, deletion failed' });
    }
  } catch (error) {
    console.error(`Error deleting reminder ${req.params.id}:`, error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error deleting reminder', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error deleting reminder', error: 'Unknown error' });
    }
  }
};
