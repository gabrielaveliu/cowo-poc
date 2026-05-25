import { Router, Request, Response } from 'express';
import { userAPI } from '../lib/api';

const router = Router();

// GET /api/users - Get all users
router.get('/', (req: Request, res: Response) => {
  try {
    const users = userAPI.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/:id - Get a specific user
router.get('/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = userAPI.getUser(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
