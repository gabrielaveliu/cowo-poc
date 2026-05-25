import {
  mockBookings,
  mockPricing,
  DEFAULT_PRICING,
  ROOMS,
  mockUsers,
} from './mockData';
import { User, MonthlyBillingReport } from '../types';

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

// Get pricing for current month
export const getCurrentMonthPricing = (): Record<string, number> => {
  const month = getCurrentMonth();
  return mockPricing[month] || DEFAULT_PRICING;
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

// Check if time slot is available
export const isTimeSlotAvailable = (
  roomId: string,
  date: string,
  startTime: string,
  endTime: string
): boolean => {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  return !mockBookings.some((booking) => {
    if (booking.roomId !== roomId || booking.date !== date) {
      return false;
    }

    const [bookH, bookM] = booking.startTime.split(':').map(Number);
    const [endBookH, endBookM] = booking.endTime.split(':').map(Number);
    const bookingStart = bookH * 60 + bookM;
    const bookingEnd = endBookH * 60 + endBookM;

    // Check for overlap
    return startMinutes < bookingEnd && endMinutes > bookingStart;
  });
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

// Get room by ID
export const getRoomById = (roomId: string) => {
  return ROOMS.find((room) => room.id === roomId);
};

// Get user by ID
export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find((user) => user.id === userId);
};

// Generate monthly billing report
export const generateMonthlyBillingReport = (
  month: string
): MonthlyBillingReport[] => {
  const reportMap: Record<
    string,
    { bookings: any[]; totalCost: number; user?: User }
  > = {};

  // Group bookings by user
  mockBookings.forEach((booking) => {
    const bookingMonth = booking.date.substring(0, 7);
    if (bookingMonth === month) {
      if (!reportMap[booking.userId]) {
        const user = getUserById(booking.userId);
        reportMap[booking.userId] = {
          bookings: [],
          totalCost: 0,
          user,
        };
      }
      reportMap[booking.userId].bookings.push(booking);
      reportMap[booking.userId].totalCost += booking.cost;
    }
  });

  // Convert to array
  return Object.entries(reportMap).map(([userId, data]) => ({
    userId,
    userName: data.user?.name || 'Unknown',
    userEmail: data.user?.email || 'unknown@example.com',
    month,
    bookings: data.bookings,
    totalCost: data.totalCost,
  }));
};
