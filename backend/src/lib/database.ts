// SQLite database setup and initialization
import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DB_DIR, 'coworking.db');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export const db: DatabaseType = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Schema ──────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    id       TEXT PRIMARY KEY,
    name     TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    color    TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id    TEXT PRIMARY KEY,
    name  TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id         TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL,
    room_id    TEXT NOT NULL,
    date       TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time   TEXT NOT NULL,
    cost       REAL NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
  );

  CREATE TABLE IF NOT EXISTS pricing (
    room_id      TEXT NOT NULL,
    month        TEXT NOT NULL,
    hourly_price REAL NOT NULL,
    PRIMARY KEY (room_id, month),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
  );
`);

// ─── Seed data ────────────────────────────────────────────────────────────────

function isSeeded(): boolean {
  const row = db.prepare('SELECT COUNT(*) AS count FROM rooms').get() as { count: number };
  return row.count > 0;
}

function seedDatabase(): void {
  if (isSeeded()) return;

  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const todayStr = today.toISOString().split('T')[0];
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const nowIso = today.toISOString();

  const insertRoom = db.prepare(
    'INSERT OR IGNORE INTO rooms (id, name, capacity, color) VALUES (?, ?, ?, ?)'
  );
  const insertUser = db.prepare(
    'INSERT OR IGNORE INTO users (id, name, email) VALUES (?, ?, ?)'
  );
  const insertPricing = db.prepare(
    'INSERT OR IGNORE INTO pricing (room_id, month, hourly_price) VALUES (?, ?, ?)'
  );
  const insertBooking = db.prepare(
    `INSERT OR IGNORE INTO bookings (id, user_id, room_id, date, start_time, end_time, cost, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const seed = db.transaction(() => {
    // Rooms
    insertRoom.run('room-1', 'Sala ROSSA', 3, 'red');
    insertRoom.run('room-2', 'Sala VERDE', 5, 'green');
    insertRoom.run('room-3', 'Sala BLU', 15, 'blue');

    // Users
    insertUser.run('user-1', 'Alice Rossi', 'alice@example.com');
    insertUser.run('user-2', 'Bob Bianchi', 'bob@example.com');
    insertUser.run('user-3', 'Carlo Verdi', 'carlo@example.com');

    // Pricing (€/hour)
    insertPricing.run('room-1', currentMonth, 25);
    insertPricing.run('room-2', currentMonth, 40);
    insertPricing.run('room-3', currentMonth, 60);

    // Bookings
    insertBooking.run('booking-1', 'user-1', 'room-1', todayStr, '10:00', '11:30', 37.5, nowIso);
    insertBooking.run('booking-2', 'user-1', 'room-2', todayStr, '14:00', '15:00', 40,   nowIso);
    insertBooking.run('booking-3', 'user-2', 'room-3', tomorrowStr, '09:00', '10:30', 90, nowIso);
    insertBooking.run('booking-4', 'user-3', 'room-1', tomorrowStr, '15:00', '16:00', 25, nowIso);
    insertBooking.run('booking-5', 'user-2', 'room-2', todayStr,    '16:00', '17:30', 60, nowIso);
  });

  seed();
}

seedDatabase();
