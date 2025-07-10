// backend/src/routes/reportRoutes.ts
import express, { Router } from 'express';
import * as reportController from '../controllers/reportController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(protect);

router.post('/', reportController.createReport);
// Admin/Moderator routes (add role-based access control later)
router.get('/', reportController.getReports);
router.put('/:reportId/status', reportController.updateReportStatus);

export default router;
