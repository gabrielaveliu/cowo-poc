'use client';

import { Booking } from '@/types';
import {
  formatDateToLocaleString,
  formatTimeRange,
  getRoomById,
} from '@/lib/utils';

interface UserBookingListProps {
  bookings: Booking[];
  onDelete?: (bookingId: string) => void;
  showDelete?: boolean;
}

export default function UserBookingList({
  bookings,
  onDelete,
  showDelete = true,
}: UserBookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p>Nessuna prenotazione trovata.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => {
        const room = getRoomById(booking.roomId);
        const colorClasses: Record<string, string> = {
          red: 'bg-red-50 border-red-200 text-red-900',
          green: 'bg-green-50 border-green-200 text-green-900',
          blue: 'bg-blue-50 border-blue-200 text-blue-900',
        };
        const badgeClasses: Record<string, string> = {
          red: 'bg-red-200 text-red-800',
          green: 'bg-green-200 text-green-800',
          blue: 'bg-blue-200 text-blue-800',
        };

        const colorClass = room ? colorClasses[room.color] : 'bg-slate-50';
        const badgeClass = room ? badgeClasses[room.color] : 'bg-slate-200';

        return (
          <div
            key={booking.id}
            className={`border rounded-lg p-4 ${colorClass}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeClass}`}>
                    {room?.name || 'Sala sconosciuta'}
                  </span>
                  <span className="text-xs text-slate-600">
                    {formatDateToLocaleString(booking.date)}
                  </span>
                </div>
                <p className="text-sm font-medium mb-1">
                  ⏰ {formatTimeRange(booking.startTime, booking.endTime)}
                </p>
                <p className="text-lg font-bold">€ {booking.cost.toFixed(2)}</p>
              </div>
              {showDelete && onDelete && (
                <button
                  onClick={() => onDelete(booking.id)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-100 px-2 py-1 rounded text-xs font-semibold ml-2"
                >
                  Elimina
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
