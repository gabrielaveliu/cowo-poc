// Mock Data Store for POC - Simulates a database
import { User, Room, Booking, RoomPricing } from '@/types';

const today = new Date();
const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

// Rooms data (Fixed)
export const ROOMS: Room[] = [
  { id: 'room-1', name: 'Sala ROSSA', capacity: 3, color: 'red' },
  { id: 'room-2', name: 'Sala VERDE', capacity: 5, color: 'green' },
  { id: 'room-3', name: 'Sala BLU', capacity: 15, color: 'blue' },
];

// Default pricing for rooms (€/hour)
export const DEFAULT_PRICING: Record<string, number> = {
  'room-1': 25, // Sala ROSSA
  'room-2': 40, // Sala VERDE
  'room-3': 60, // Sala BLU
};

// Mock users
export const INITIAL_USERS: User[] = [
  { id: 'user-1', name: 'Alice Rossi', email: 'alice@example.com' },
  { id: 'user-2', name: 'Bob Bianchi', email: 'bob@example.com' },
  { id: 'user-3', name: 'Carlo Verdi', email: 'carlo@example.com' },
];

// Mock bookings (starting from today)
export const generateMockBookings = (): Booking[] => {
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return [
    {
      id: 'booking-1',
      userId: 'user-1',
      roomId: 'room-1',
      date: today.toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '11:30',
      cost: 37.5, // 1.5h * 25€
      createdAt: today.toISOString(),
    },
    {
      id: 'booking-2',
      userId: 'user-1',
      roomId: 'room-2',
      date: today.toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '15:00',
      cost: 40, // 1h * 40€
      createdAt: today.toISOString(),
    },
    {
      id: 'booking-3',
      userId: 'user-2',
      roomId: 'room-3',
      date: tomorrow.toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:30',
      cost: 90, // 1.5h * 60€
      createdAt: today.toISOString(),
    },
    {
      id: 'booking-4',
      userId: 'user-3',
      roomId: 'room-1',
      date: tomorrow.toISOString().split('T')[0],
      startTime: '15:00',
      endTime: '16:00',
      cost: 25, // 1h * 25€
      createdAt: today.toISOString(),
    },
    {
      id: 'booking-5',
      userId: 'user-2',
      roomId: 'room-2',
      date: today.toISOString().split('T')[0],
      startTime: '16:00',
      endTime: '17:30',
      cost: 60, // 1.5h * 40€
      createdAt: today.toISOString(),
    },
  ];
};

// In-memory data storage
export let mockUsers: User[] = [...INITIAL_USERS];
export let mockBookings: Booking[] = generateMockBookings();
export let mockPricing: Record<string, Record<string, number>> = {
  [currentMonth]: DEFAULT_PRICING,
};

// Reset data
export const resetMockData = () => {
  mockUsers = [...INITIAL_USERS];
  mockBookings = generateMockBookings();
  mockPricing = {
    [currentMonth]: DEFAULT_PRICING,
  };
};

// Helper: Get current month pricing
export const getCurrentMonthPricing = (): Record<string, number> => {
  return mockPricing[currentMonth] || DEFAULT_PRICING;
};
