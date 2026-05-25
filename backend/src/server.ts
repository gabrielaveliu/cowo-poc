import express, { Request, Response } from 'express';
import cors from 'cors';
import bookingsRouter from './routes/bookings';
import pricingRouter from './routes/pricing';
import billingRouter from './routes/billing';
import usersRouter from './routes/users';
import { bookingAPI } from './lib/api';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bookings', bookingsRouter);

// DELETE /api/bookings/:id handler
app.delete('/api/bookings/:id', (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;

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

app.use('/api/pricing', pricingRouter);
app.use('/api/billing', billingRouter);
app.use('/api/users', usersRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Coworking Meeting POC Backend API',
    version: '1.0.0',
    endpoints: {
      bookings: '/api/bookings',
      pricing: '/api/pricing',
      billing: '/api/billing',
      users: '/api/users',
      health: '/health',
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
