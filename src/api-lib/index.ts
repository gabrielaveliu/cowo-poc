// API lib for server-side operations
import {
  mockBookings,
  mockUsers,
  mockPricing,
  getCurrentMonthPricing,
} from '@/lib/mockData';
import {
  calculateBookingCost,
  generateMonthlBillingReport,
} from '@/lib/utils';
import { Booking } from '@/types';

export const bookingAPI = {
  // Get all bookings
  getAllBookings: () => [...mockBookings],

  // Get bookings for a specific user
  getUserBookings: (userId: string) => {
    return mockBookings.filter((b) => b.userId === userId);
  },

  // Create a new booking
  createBooking: (
    userId: string,
    roomId: string,
    date: string,
    startTime: string,
    endTime: string
  ) => {
    const pricing = getCurrentMonthPricing();
    const cost = calculateBookingCost(roomId, startTime, endTime, pricing);

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      userId,
      roomId,
      date,
      startTime,
      endTime,
      cost,
      createdAt: new Date().toISOString(),
    };

    mockBookings.push(newBooking);
    return newBooking;
  },

  // Delete a booking
  deleteBooking: (bookingId: string) => {
    const index = mockBookings.findIndex((b) => b.id === bookingId);
    if (index > -1) {
      mockBookings.splice(index, 1);
      return true;
    }
    return false;
  },
};

export const pricingAPI = {
  // Get pricing for a specific month
  getMonthPricing: (month: string) => {
    return mockPricing[month] || getCurrentMonthPricing();
  },

  // Update pricing for a room in a month
  updateRoomPricing: (roomId: string, month: string, price: number) => {
    if (!mockPricing[month]) {
      mockPricing[month] = { ...getCurrentMonthPricing() };
    }
    mockPricing[month][roomId] = price;
  },

  // Get all pricing records
  getAllPricing: () => mockPricing,
};

export const billingAPI = {
  // Generate billing report for a month
  generateMonthlyReport: (month: string) => {
    return generateMonthlBillingReport(month);
  },

  // Get total cost for a user in a month
  getUserMonthlyCost: (userId: string, month: string) => {
    return mockBookings
      .filter((b) => b.userId === userId && b.date.startsWith(month))
      .reduce((sum, b) => sum + b.cost, 0);
  },
};

export const userAPI = {
  // Get all users
  getAllUsers: () => [...mockUsers],

  // Get a specific user
  getUser: (userId: string) => {
    return mockUsers.find((u) => u.id === userId);
  },
};
