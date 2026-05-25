import { Router, Request, Response } from 'express';
import { pricingAPI } from '../lib/api';

const router = Router();

// GET /api/pricing - Get pricing for a specific month or all pricing
router.get('/', (req: Request, res: Response) => {
  try {
    const month = req.query.month as string | undefined;

    if (!month) {
      const allPricing = pricingAPI.getAllPricing();
      res.json(allPricing);
      return;
    }

    const pricing = pricingAPI.getMonthPricing(month);
    res.json(pricing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pricing' });
  }
});

// POST /api/pricing - Update pricing for a month
router.post('/', (req: Request, res: Response) => {
  try {
    const { month, pricing } = req.body;

    if (!month || !pricing) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    for (const [roomId, price] of Object.entries(pricing)) {
      pricingAPI.updateRoomPricing(roomId, month, price as number);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update pricing' });
  }
});

// PATCH /api/pricing - Partially update pricing for a month
router.patch('/', (req: Request, res: Response) => {
  try {
    const { month, pricing, roomId, hourlyPrice } = req.body;

    if (!month || (!pricing && (!roomId || hourlyPrice === undefined))) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (pricing) {
      for (const [id, price] of Object.entries(pricing)) {
        pricingAPI.updateRoomPricing(id, month, price as number);
      }
    } else {
      pricingAPI.updateRoomPricing(roomId, month, hourlyPrice as number);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update pricing' });
  }
});

export default router;
