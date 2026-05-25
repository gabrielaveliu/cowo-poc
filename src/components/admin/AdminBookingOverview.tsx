'use client';

import { useState, useEffect } from 'react';
import { Booking } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  formatDateToLocaleString,
  formatTimeRange,
  getRoomById,
  getUserById,
} from '@/lib/utils';
import { apiClient } from '@/lib/api';

export default function AdminBookingOverview() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRoomId, setFilterRoomId] = useState<string>('');
  const [filterUserId, setFilterUserId] = useState<string>('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await apiClient.getAllBookings();
      setBookings(data.sort((a: Booking, b: Booking) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }));
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa prenotazione?')) return;

    try {
      await apiClient.deleteBooking(bookingId);
      setBookings(bookings.filter((b) => b.id !== bookingId));
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterRoomId && b.roomId !== filterRoomId) return false;
    if (filterUserId && b.userId !== filterUserId) return false;
    return true;
  });

  const uniqueRooms = Array.from(new Set(bookings.map((b) => b.roomId)));
  const uniqueUsers = Array.from(new Set(bookings.map((b) => b.userId)));

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border border-slate-200">
      <h2 className="text-3xl font-bold mb-8 text-slate-800">📅 Panoramica Prenotazioni</h2>

      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <Label htmlFor="room-filter" className="text-slate-700 font-semibold">
            Filtra per Sala
          </Label>
          <Select value={filterRoomId} onValueChange={(value) => setFilterRoomId(value || '')}>
            <SelectTrigger id="room-filter" className="text-slate-700">
              <SelectValue placeholder="Tutte le sale" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tutte le sale</SelectItem>
              {uniqueRooms.map((roomId) => {
                const room = getRoomById(roomId);
                return (
                  <SelectItem key={roomId} value={roomId}>
                    {room?.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="user-filter" className="text-slate-700 font-semibold">
            Filtra per Utente
          </Label>
          <Select value={filterUserId} onValueChange={(value) => setFilterUserId(value || '')}>
            <SelectTrigger id="user-filter" className="text-slate-700">
              <SelectValue placeholder="Tutti gli utenti" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tutti gli utenti</SelectItem>
              {uniqueUsers.map((userId) => {
                const user = getUserById(userId);
                return (
                  <SelectItem key={userId} value={userId}>
                    {user?.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <p className="text-slate-500 text-center py-8">⏳ Caricamento...</p>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p>Nessuna prenotazione trovata.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((booking) => {
            const room = getRoomById(booking.roomId);
            const user = getUserById(booking.userId);
            const colorClasses: Record<string, string> = {
              red: 'bg-red-50 border-red-200',
              green: 'bg-green-50 border-green-200',
              blue: 'bg-blue-50 border-blue-200',
            };
            const badgeClasses: Record<string, string> = {
              red: 'bg-red-200 text-red-800',
              green: 'bg-green-200 text-green-800',
              blue: 'bg-blue-200 text-blue-800',
            };

            const colorClass = room ? colorClasses[room.color] : 'bg-slate-50';
            const badgeClass = room ? badgeClasses[room.color] : 'bg-slate-200';

            return (
              <div key={booking.id} className={`border rounded-lg p-5 ${colorClass} transition-shadow hover:shadow-md`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
                        {room?.name}
                      </span>
                      <span className="text-xs bg-slate-200 text-slate-800 px-3 py-1 rounded-full font-medium">
                        👤 {user?.name}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 font-medium mb-2">
                      📅 {formatDateToLocaleString(booking.date)}
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      ⏰ {formatTimeRange(booking.startTime, booking.endTime)}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-3xl font-bold text-slate-800 mb-3">
                      € {booking.cost.toFixed(2)}
                    </p>
                    <Button
                      onClick={() => handleDeleteBooking(booking.id)}
                      variant="destructive"
                      size="sm"
                      className="text-white font-semibold"
                    >
                      Elimina
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
