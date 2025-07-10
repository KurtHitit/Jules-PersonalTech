// backend/src/routes/technicianRoutes.ts
import express, { Router } from 'express';
import * as technicianController from '../controllers/technicianController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Routes that do not require authentication (e.g., for public listing)
router.get('/', technicianController.getAllTechnicians);
router.get('/:id', technicianController.getTechnicianById);

// Routes that require authentication (e.g., for admin or technician management)
// Apply 'protect' middleware to these routes
router.use(protect);

router.post('/', technicianController.createTechnician);
router.put('/:id', technicianController.updateTechnician);
router.delete('/:id', technicianController.deleteTechnician);

export default router;
