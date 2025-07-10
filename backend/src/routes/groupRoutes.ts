// backend/src/routes/groupRoutes.ts
import express, { Router } from 'express';
import * as groupController from '../controllers/groupController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(protect);

router.post('/', groupController.createGroup);
router.get('/search', groupController.searchGroups);
router.post('/:groupId/join', groupController.joinGroup);
router.post('/:groupId/leave', groupController.leaveGroup);

export default router;
