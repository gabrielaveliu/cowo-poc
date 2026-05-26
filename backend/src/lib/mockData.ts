// Static reference data — kept for documentation purposes.
// The authoritative data now lives in the SQLite database (data/coworking.db).
// See database.ts for schema and seeding logic.

import { Room } from '../types';

export const ROOMS: Room[] = [
  { id: 'room-1', name: 'Sala ROSSA', capacity: 3, color: 'red' },
  { id: 'room-2', name: 'Sala VERDE', capacity: 5, color: 'green' },
  { id: 'room-3', name: 'Sala BLU', capacity: 15, color: 'blue' },
];

export const DEFAULT_PRICING: Record<string, number> = {
  'room-1': 25,
  'room-2': 40,
  'room-3': 60,
};
