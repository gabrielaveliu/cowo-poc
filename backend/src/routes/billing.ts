import { Router, Request, Response } from 'express';
import { billingAPI } from '../lib/api';

const router = Router();

// GET /api/billing - Get billing report for a month
router.get('/', (req: Request, res: Response) => {
  try {
    const month = req.query.month as string | undefined;

    if (!month) {
      res.status(400).json({ error: 'Month parameter is required' });
      return;
    }

    const report = billingAPI.generateMonthlyReport(month);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate billing report' });
  }
});

export default router;
