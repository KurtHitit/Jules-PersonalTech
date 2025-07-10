// backend/src/controllers/serviceHistoryController.ts
import { Request, Response } from 'express';
import * as serviceHistoryService from '../services/serviceHistoryService';

// @desc    Create a new service history entry for an item
// @route   POST /api/items/:itemId/history
// @access  Private
export const createServiceHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params; // Get itemId from URL params
    const serviceHistoryData = req.body; // Expects serviceType, dateOfService, etc.

    // Ensure the item belongs to the authenticated user (optional, but good practice)
    // This would typically involve checking the item against req.user.id
    // For now, we'll assume the itemId is valid and accessible to the user via other means.

    const newEntry = await serviceHistoryService.createServiceHistory({ ...serviceHistoryData, itemId });

    res.status(201).json({
      message: 'Service history entry created successfully',
      serviceHistory: newEntry,
    });
  } catch (error) {
    console.error('Error creating service history entry:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error creating service history entry', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error creating service history entry', error: 'Unknown error' });
    }
  }
};

// @desc    Get all service history entries for a specific item
// @route   GET /api/items/:itemId/history
// @access  Private
export const getServiceHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const history = await serviceHistoryService.getServiceHistoryByItemId(itemId);

    res.status(200).json({
      message: 'Service history fetched successfully',
      serviceHistory: history,
    });
  } catch (error) {
    console.error('Error fetching service history:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error fetching service history', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error fetching service history', error: 'Unknown error' });
    }
  }
};

// @desc    Get a single service history entry by ID for a specific item
// @route   GET /api/items/:itemId/history/:entryId
// @access  Private
export const getServiceHistoryEntryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId, entryId } = req.params;
    const entry = await serviceHistoryService.getServiceHistoryEntryById(entryId, itemId);

    if (entry) {
      res.status(200).json({ message: 'Service history entry fetched successfully', serviceHistory: entry });
    } else {
      res.status(404).json({ message: 'Service history entry not found or not associated with item' });
    }
  } catch (error) {
    console.error(`Error fetching service history entry ${req.params.entryId}:`, error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error fetching service history entry', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error fetching service history entry', error: 'Unknown error' });
    }
  }
};

// @desc    Update a service history entry for a specific item
// @route   PUT /api/items/:itemId/history/:entryId
// @access  Private
export const updateServiceHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId, entryId } = req.params;
    const updates = req.body;

    const updatedEntry = await serviceHistoryService.updateServiceHistory(entryId, updates, itemId);

    if (updatedEntry) {
      res.status(200).json({ message: 'Service history entry updated successfully', serviceHistory: updatedEntry });
    } else {
      res.status(404).json({ message: 'Service history entry not found, cannot update, or not associated with item' });
    }
  } catch (error) {
    console.error(`Error updating service history entry ${req.params.entryId}:`, error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error updating service history entry', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error updating service history entry', error: 'Unknown error' });
    }
  }
};

// @desc    Delete a service history entry for a specific item
// @route   DELETE /api/items/:itemId/history/:entryId
// @access  Private
export const deleteServiceHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId, entryId } = req.params;
    const success = await serviceHistoryService.deleteServiceHistory(entryId, itemId);

    if (success) {
      res.status(200).json({ message: 'Service history entry deleted successfully' });
    } else {
      res.status(404).json({ message: 'Service history entry not found or not associated with item, deletion failed' });
    }
  } catch (error) {
    console.error(`Error deleting service history entry ${req.params.entryId}:`, error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error deleting service history entry', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error deleting service history entry', error: 'Unknown error' });
    }
  }
};
