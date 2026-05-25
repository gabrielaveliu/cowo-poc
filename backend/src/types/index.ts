// Domain Types for Coworking Meeting Room Management POC

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  color: string; // 'red' | 'green' | 'blue'
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  cost: number;
  createdAt: string;
}

export interface RoomPricing {
  roomId: string;
  month: string; // YYYY-MM
  hourlyPrice: number;
}

export interface MonthlyBillingReport {
  userId: string;
  userName: string;
  userEmail: string;
  month: string;
  bookings: Booking[];
  totalCost: number;
}
