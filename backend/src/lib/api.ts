// API lib - backed by SQLite via better-sqlite3
import { db } from './database';
import { calculateBookingCost, getCurrentMonth } from './utils';
import { Booking, User, MonthlyBillingReport } from '../types';

// ─── Row mappers ──────────────────────────────────────────────────────────────

function rowToBooking(row: any): Booking {
  return {
    id: row.id,
    userId: row.user_id,
    roomId: row.room_id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    cost: row.cost,
    createdAt: row.created_at,
  };
}

function rowToUser(row: any): User {
  return { id: row.id, name: row.name, email: row.email };
}

// ─── Booking API ──────────────────────────────────────────────────────────────

export const bookingAPI = {
  getAllBookings: (): Booking[] => {
    const rows = db.prepare('SELECT * FROM bookings ORDER BY date, start_time').all();
    return rows.map(rowToBooking);
  },

  getUserBookings: (userId: string): Booking[] => {
    const rows = db
      .prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY date, start_time')
      .all(userId);
    return rows.map(rowToBooking);
  },

  createBooking: (
    userId: string,
    roomId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Booking => {
    const month = date.slice(0, 7);
    const pricing = pricingAPI.getMonthPricing(month);
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

    db.prepare(
      `INSERT INTO bookings (id, user_id, room_id, date, start_time, end_time, cost, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      newBooking.id,
      newBooking.userId,
      newBooking.roomId,
      newBooking.date,
      newBooking.startTime,
      newBooking.endTime,
      newBooking.cost,
      newBooking.createdAt
    );

    return newBooking;
  },

  deleteBooking: (bookingId: string): boolean => {
    const result = db.prepare('DELETE FROM bookings WHERE id = ?').run(bookingId);
    return result.changes > 0;
  },
};

// ─── Pricing API ──────────────────────────────────────────────────────────────

export const pricingAPI = {
  getMonthPricing: (month: string): Record<string, number> => {
    const rows = db
      .prepare('SELECT room_id, hourly_price FROM pricing WHERE month = ?')
      .all(month) as { room_id: string; hourly_price: number }[];

    if (rows.length === 0) {
      // Fall back to current month pricing
      const currentMonth = getCurrentMonth();
      const fallback = db
        .prepare('SELECT room_id, hourly_price FROM pricing WHERE month = ?')
        .all(currentMonth) as { room_id: string; hourly_price: number }[];
      return Object.fromEntries(fallback.map((r) => [r.room_id, r.hourly_price]));
    }

    return Object.fromEntries(rows.map((r) => [r.room_id, r.hourly_price]));
  },

  updateRoomPricing: (roomId: string, month: string, price: number): void => {
    db.prepare(
      `INSERT INTO pricing (room_id, month, hourly_price) VALUES (?, ?, ?)
       ON CONFLICT(room_id, month) DO UPDATE SET hourly_price = excluded.hourly_price`
    ).run(roomId, month, price);
  },

  getAllPricing: (): Record<string, Record<string, number>> => {
    const rows = db
      .prepare('SELECT room_id, month, hourly_price FROM pricing')
      .all() as { room_id: string; month: string; hourly_price: number }[];

    const result: Record<string, Record<string, number>> = {};
    for (const row of rows) {
      if (!result[row.month]) result[row.month] = {};
      result[row.month][row.room_id] = row.hourly_price;
    }
    return result;
  },
};

// ─── Billing API ──────────────────────────────────────────────────────────────

export const billingAPI = {
  generateMonthlyReport: (month: string): MonthlyBillingReport[] => {
    const rows = db
      .prepare(
        `SELECT b.*, u.name AS user_name, u.email AS user_email
         FROM bookings b
         JOIN users u ON b.user_id = u.id
         WHERE substr(b.date, 1, 7) = ?
         ORDER BY b.user_id, b.date, b.start_time`
      )
      .all(month) as any[];

    const reportMap: Record<string, MonthlyBillingReport> = {};
    for (const row of rows) {
      if (!reportMap[row.user_id]) {
        reportMap[row.user_id] = {
          userId: row.user_id,
          userName: row.user_name,
          userEmail: row.user_email,
          month,
          bookings: [],
          totalCost: 0,
        };
      }
      reportMap[row.user_id].bookings.push(rowToBooking(row));
      reportMap[row.user_id].totalCost += row.cost;
    }

    return Object.values(reportMap);
  },

  getUserMonthlyCost: (userId: string, month: string): number => {
    const row = db
      .prepare(
        `SELECT COALESCE(SUM(cost), 0) AS total
         FROM bookings
         WHERE user_id = ? AND substr(date, 1, 7) = ?`
      )
      .get(userId, month) as { total: number };
    return row.total;
  },
};

// ─── User API ─────────────────────────────────────────────────────────────────

export const userAPI = {
  getAllUsers: (): User[] => {
    const rows = db.prepare('SELECT * FROM users ORDER BY name').all();
    return rows.map(rowToUser);
  },

  getUser: (userId: string): User | undefined => {
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    return row ? rowToUser(row) : undefined;
  },
};
