// backend/src/routes/itemRoutes.ts
import express, { Router } from 'express';
import * as itemController from '../controllers/itemController';
import { protect } from '../middleware/authMiddleware'; // Import the protect middleware

const router: Router = express.Router();

// All item routes are protected and require authentication.
// The 'protect' middleware will be applied to all routes defined after it in this router.
// If you need to apply it selectively, you can add it as an argument to individual router methods.
// e.g., router.post('/', protect, itemController.createItem);

router.use(protect); // Apply protect middleware to all routes in this file

// @route   POST api/items
// @desc    Create a new item
// @access  Private
router.post('/', itemController.createItem);

// @route   GET api/items
// @desc    Get all items for the authenticated user
// @access  Private
router.get('/', itemController.getItems);

// @route   GET api/items/:id
// @desc    Get a single item by its ID
// @access  Private
router.get('/:id', itemController.getItemById);

// @route   PUT api/items/:id
// @desc    Update an existing item
// @access  Private
router.put('/:id', itemController.updateItem);

// @route   DELETE api/items/:id
// @desc    Delete an item by its ID
// @access  Private
router.delete('/:id', itemController.deleteItem);

export default router;
