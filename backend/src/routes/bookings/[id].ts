import { Router, Request, Response } from 'express';
import { bookingAPI } from '../../lib/api';

const router = Router({ mergeParams: true });

// DELETE /api/bookings/:id - Delete a booking
router.delete('/', (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id as string;

    if (!bookingId) {
      res.status(400).json({ error: 'Booking ID is required' });
      return;
    }

    const deleted = bookingAPI.deleteBooking(bookingId);

    if (!deleted) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

export default router;
