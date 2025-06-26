// backend/src/controllers/itemController.ts
import { Request, Response } from 'express';
import * as itemService from '../services/itemService'; // Placeholder for service interactions
import { Item, createMockItem } from '../models/Item'; // Using Item interface and mock creator

// @desc    Create a new item
// @route   POST /api/items
// @access  Private (to be implemented)
export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    // For now, we'll assume req.body is valid and matches part of the Item structure
    // In a real app, add validation (e.g., using express-validator)
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   res.status(400).json({ errors: errors.array() });
    //   return;
    // }

    // const newItemData = req.body;
    // const userId = (req as any).user.id; // Assuming user ID is attached by auth middleware
    // const item = await itemService.createItem(newItemData, userId);

    // Mock implementation:
    const mockItem = createMockItem(req.body);
    console.log('Mock creating item:', mockItem);
    // Simulate service call
    // const item = await itemService.createItem(mockItem, 'mockUserId'); // Old mock
    const userId = req.user!.id; // req.user is guaranteed by 'protect' middleware
    const item = await itemService.createItem(req.body, userId);

    res.status(201).json({ message: 'Item created successfully', item: item });
  } catch (error) {
    console.error('Error creating item:', error);
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error creating item', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error creating item', error: 'Unknown error' });
    }
  }
};

// @desc    Get all items for the authenticated user
// @route   GET /api/items
// @access  Private
export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    // const userId = (req as any).user.id; // Assuming user ID is attached by auth middleware
    const userId = req.user!.id; // req.user is guaranteed by 'protect' middleware
    const items = await itemService.getItemsByUserId(userId);

    res.status(200).json({ message: 'Items fetched successfully', items: items });
  } catch (error)
    console.error('Error fetching items:', error);
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error fetching items', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error fetching items', error: 'Unknown error' });
    }
  }
};

// @desc    Get a single item by its ID
// @route   GET /api/items/:id
// @access  Private
export const getItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const itemId = req.params.id;
    const userId = req.user!.id; // req.user is guaranteed by 'protect' middleware
    const item = await itemService.getItemById(itemId, userId);

    if (item) {
      res.status(200).json({ message: 'Item fetched successfully', item: item });
    } else {
      res.status(404).json({ message: 'Item not found or not owned by user' });
    }
  } catch (error) {
    console.error(`Error fetching item by ID ${req.params.id}:`, error);
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error fetching item by ID', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error fetching item by ID', error: 'Unknown error' });
    }
  }
};

// @desc    Update an existing item
// @route   PUT /api/items/:id
// @access  Private
export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const itemId = req.params.id;
    const updates = req.body;
    const itemId = req.params.id;
    const updates = req.body;
    const userId = req.user!.id; // req.user is guaranteed by 'protect' middleware

    // In a real app, add validation for updates
    const item = await itemService.updateItem(itemId, updates, userId);

    if (item) {
      res.status(200).json({ message: 'Item updated successfully', item: item });
    } else {
      res.status(404).json({ message: 'Item not found, cannot update, or not owned by user' });
    }
  } catch (error) {
    console.error(`Error updating item ${req.params.id}:`, error);
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error updating item', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error updating item', error: 'Unknown error' });
    }
  }
};

// @desc    Delete an item by its ID
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const itemId = req.params.id;
    const userId = req.user!.id; // req.user is guaranteed by 'protect' middleware
    const success = await itemService.deleteItem(itemId, userId);

    if (success) {
      res.status(200).json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Item not found or not owned by user, deletion failed' });
    }
  } catch (error) {
    console.error(`Error deleting item ${req.params.id}:`, error);
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error deleting item', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error deleting item', error: 'Unknown error' });
    }
  }
};
