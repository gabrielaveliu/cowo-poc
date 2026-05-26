import { db } from './database';
import { Room } from '../types';

// Get current month in YYYY-MM format
export const getCurrentMonth = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
};

// Get available months for pricing (current + 3 months)
export const getAvailableMonths = (): string[] => {
  const months: string[] = [];
  const today = new Date();

  for (let i = 0; i < 4; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months.push(month);
  }

  return months;
};

// Calculate booking cost
export const calculateBookingCost = (
  roomId: string,
  startTime: string,
  endTime: string,
  pricing: Record<string, number>
): number => {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  const durationHours = (endMinutes - startMinutes) / 60;
  const pricePerHour = pricing[roomId] || 0;

  return durationHours * pricePerHour;
};

// Check if time slot is available (queries the SQLite DB)
export const isTimeSlotAvailable = (
  roomId: string,
  date: string,
  startTime: string,
  endTime: string
): boolean => {
  const row = db
    .prepare(
      `SELECT COUNT(*) AS cnt
       FROM bookings
       WHERE room_id = ? AND date = ?
         AND start_time < ? AND end_time > ?`
    )
    .get(roomId, date, endTime, startTime) as { cnt: number };

  return row.cnt === 0;
};

// Format date to locale string
export const formatDateToLocaleString = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format time range
export const formatTimeRange = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`;
};

// Get room by ID (queries the SQLite DB)
export const getRoomById = (roomId: string): Room | undefined => {
  const row = db.prepare('SELECT * FROM rooms WHERE id = ?').get(roomId) as Room | undefined;
  return row;
};
