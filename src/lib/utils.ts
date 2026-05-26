import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { mockBookings, mockPricing, DEFAULT_PRICING, ROOMS, mockUsers } from './mockData'
import { Booking, User, MonthlyBillingReport } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get current month in YYYY-MM format
export const getCurrentMonth = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
}

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
}

// Get pricing for current month
export const getCurrentMonthPricing = (): Record<string, number> => {
  const month = getCurrentMonth();
  return mockPricing[month] || DEFAULT_PRICING;
}

// Get month string (YYYY-MM) from a date string
export const getMonthFromDate = (date: string): string => {
  return date.slice(0, 7);
}

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
}

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
}

export type TimeRange = {
  startTime: string;
  endTime: string;
};

export const getAvailableTimeRanges = (
  roomId: string,
  date: string,
  bookings: Booking[],
  businessStart = '08:00',
  businessEnd = '20:00'
): TimeRange[] => {
  // Se è la data odierna, considera l'ora attuale
  let adjustedBusinessStart = businessStart;
  const today = new Date().toISOString().split('T')[0];
  if (date === today) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    
    // Arrotonda all'ora successiva se ci sono minuti
    const nextHour = currentMinutes > 0 ? currentHour + 1 : currentHour;
    adjustedBusinessStart = `${String(nextHour).padStart(2, '0')}:00`;
  }

  const roomBookings = bookings
    .filter((booking) => booking.roomId === roomId && booking.date === date)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const getMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const businessStartMinutes = getMinutes(adjustedBusinessStart);
  const businessEndMinutes = getMinutes(businessEnd);
  const ranges: TimeRange[] = [];

  let freeStart = businessStartMinutes;

  for (const booking of roomBookings) {
    const bookingStart = getMinutes(booking.startTime);
    const bookingEnd = getMinutes(booking.endTime);

    if (bookingStart > freeStart) {
      ranges.push({
        startTime: `${String(Math.floor(freeStart / 60)).padStart(2, '0')}:${String(freeStart % 60).padStart(2, '0')}`,
        endTime: `${String(Math.floor(bookingStart / 60)).padStart(2, '0')}:${String(bookingStart % 60).padStart(2, '0')}`,
      });
    }

    freeStart = Math.max(freeStart, bookingEnd);
  }

  if (freeStart < businessEndMinutes) {
    ranges.push({
      startTime: `${String(Math.floor(freeStart / 60)).padStart(2, '0')}:${String(freeStart % 60).padStart(2, '0')}`,
      endTime: `${String(Math.floor(businessEndMinutes / 60)).padStart(2, '0')}:${String(businessEndMinutes % 60).padStart(2, '0')}`,
    });
  }

  return ranges;
};

// Format date to locale string
export const formatDateToLocaleString = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format time range
export const formatTimeRange = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`;
}

// Get room by ID
export const getRoomById = (roomId: string) => {
  return ROOMS.find((room) => room.id === roomId);
}

// Get user by ID
export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find((user) => user.id === userId);
}

// Generate monthly billing report
export const generateMonthlBillingReport = (month: string): MonthlyBillingReport[] => {
  const reportMap: Record<string, { bookings: any[], totalCost: number, user?: User }> = {};
  
  // Group bookings by user
  mockBookings.forEach((booking) => {
    const bookingMonth = booking.date.substring(0, 7);
    if (bookingMonth === month) {
      if (!reportMap[booking.userId]) {
        const user = getUserById(booking.userId);
        reportMap[booking.userId] = {
          bookings: [],
          totalCost: 0,
          user
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
    totalCost: data.totalCost
  }));
}
