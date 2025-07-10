// backend/src/routes/forumRoutes.ts
import express, { Router } from 'express';
import * as forumController from '../controllers/forumController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(protect);

router.post('/', forumController.createThread);
router.get('/', forumController.getThreads);
router.get('/:threadId', forumController.getThreadById);
router.post('/:threadId/replies', forumController.addReply);
router.post('/posts/:postId/upvote', forumController.upvotePost);
router.post('/:threadId/posts/:postId/accept-answer', forumController.acceptAnswer);
router.get('/:threadId/summarize', forumController.summarizeThread);

export default router;
