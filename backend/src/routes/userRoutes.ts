import { Router } from 'express';
import { signUp, login } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/signup', signUp);
router.post('/login', login);

// Protected route example
router.get('/profile', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'This is a protected route', user: (req as any).user });
});

export default router;
