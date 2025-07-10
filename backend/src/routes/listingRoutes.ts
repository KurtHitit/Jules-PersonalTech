// backend/src/routes/listingRoutes.ts
import express, { Router } from 'express';
import * as listingController from '../controllers/listingController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(protect);

router.post('/', listingController.createListing);
router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListingById);
router.put('/:id', listingController.updateListing);
router.delete('/:id', listingController.deleteListing);

export default router;
