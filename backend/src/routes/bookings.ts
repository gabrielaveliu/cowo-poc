import { Router, Request, Response } from 'express';
import { bookingAPI } from '../lib/api';

const router = Router();

// GET /api/bookings - Get all bookings or bookings for a specific user
router.get('/', (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string | undefined;

    let bookings;
    if (userId) {
      bookings = bookingAPI.getUserBookings(userId);
    } else {
      bookings = bookingAPI.getAllBookings();
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// POST /api/bookings - Create a new booking
router.post('/', (req: Request, res: Response) => {
  try {
    const { userId, roomId, date, startTime, endTime } = req.body;

    if (!userId || !roomId || !date || !startTime || !endTime) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const booking = bookingAPI.createBooking(userId, roomId, date, startTime, endTime);

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

export default router;
