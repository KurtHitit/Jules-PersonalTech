// backend/src/routes/disputeRoutes.ts
import express, { Router } from 'express';
import * as disputeController from '../controllers/disputeController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(protect);

router.post('/', disputeController.createDispute);
router.get('/my-disputes', disputeController.getUserDisputes);
router.get('/', disputeController.getAllDisputes); // Admin/Moderator route
router.put('/:id', disputeController.updateDispute); // Admin/Moderator route

export default router;
