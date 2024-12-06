import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getAllEvents,
  createEvent,
  deleteEvent,
} from '../controllers/eventController';

const router = Router();

// Fetch all events (public route)
router.get('/', getAllEvents);

// Create a new event (protected route for admins)
router.post('/', authenticateToken, createEvent);

// Delete an event by ID (protected route for admins)
router.delete('/:id', authenticateToken, deleteEvent);

export default router;
