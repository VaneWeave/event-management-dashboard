import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  registerForEvent,
  getRegistrationsForEvent,
} from '../controllers/registrationController';

const router = Router();

router.post('/', authenticateToken, registerForEvent);
router.get('/:eventId', authenticateToken, getRegistrationsForEvent); 

export default router;
