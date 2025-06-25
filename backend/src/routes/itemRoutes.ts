// backend/src/routes/itemRoutes.ts
import express, { Router } from 'express';
import * as itemController from '../controllers/itemController'; // Placeholder import

const router: Router = express.Router();

// @route   POST api/items
// @desc    Create a new item
// @access  Private (Protected Route - to be implemented)
router.post('/', itemController.createItem); // Placeholder controller function

// @route   GET api/items
// @desc    Get all items for the authenticated user
// @access  Private
router.get('/', itemController.getItems); // Placeholder controller function

// @route   GET api/items/:id
// @desc    Get a single item by its ID
// @access  Private
router.get('/:id', itemController.getItemById); // Placeholder controller function

// @route   PUT api/items/:id
// @desc    Update an existing item
// @access  Private
router.put('/:id', itemController.updateItem); // Placeholder controller function

// @route   DELETE api/items/:id
// @desc    Delete an item by its ID
// @access  Private
router.delete('/:id', itemController.deleteItem); // Placeholder controller function

export default router;
