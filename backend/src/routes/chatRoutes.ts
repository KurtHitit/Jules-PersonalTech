// backend/src/routes/chatRoutes.ts
import express, { Router } from 'express';
import * as chatController from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(protect);

router.get('/conversations', chatController.getConversations);
router.get('/:userId2', chatController.getChatHistory);

export default router;
