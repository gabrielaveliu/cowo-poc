'use client';

import { useState, useEffect } from 'react';
import { Booking } from '@/types';
import BookingForm from './BookingForm';
import UserBookingList from './UserBookingList';
import {
  getUserById,
  formatDateToLocaleString,
  getAvailableMonths,
} from '@/lib/utils';
import { getCurrentMonthPricing } from '@/lib/mockData';
import { apiClient } from '@/lib/api';

interface UserDashboardProps {
  userId: string;
}

export default function UserDashboard({ userId }: UserDashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [monthlyCost, setMonthlyCost] = useState<number>(0);

  const user = getUserById(userId);
  const availableMonths = getAvailableMonths();

  useEffect(() => {
    if (availableMonths.length > 0) {
      setSelectedMonth(availableMonths[0]);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [userId]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getUserBookings(userId);
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMonth) {
      const monthlyTotal = bookings
        .filter((b) => b.date.startsWith(selectedMonth))
        .reduce((sum, b) => sum + b.cost, 0);
      setMonthlyCost(monthlyTotal);
    }
  }, [selectedMonth, bookings]);

  const handleBookingCreated = (newBooking: Booking) => {
    setBookings([...bookings, newBooking]);
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

  const userBookings = bookings.filter((b) => b.date >= new Date().toISOString().split('T')[0]);
  const monthlyBookings = userBookings.filter((b) => b.date.startsWith(selectedMonth));

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Utente non trovato</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-1">Benvenuto, {user.name}!</h1>
        <p className="text-blue-100">{user.email}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Monthly Cost Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-orange-500">
          <p className="text-sm text-slate-600 mb-1">💰 Costo Mese</p>
          <p className="text-sm text-slate-500 mb-3">{selectedMonth}</p>
          <p className="text-4xl font-bold text-orange-600">€ {monthlyCost.toFixed(2)}</p>
        </div>

        {/* Total Bookings Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500">
          <p className="text-sm text-slate-600 mb-1">📅 Prenotazioni Mese</p>
          <p className="text-sm text-slate-500 mb-3">{selectedMonth}</p>
          <p className="text-4xl font-bold text-green-600">{monthlyBookings.length}</p>
        </div>

        {/* Month Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Seleziona Mese
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {new Date(`${month}-01`).toLocaleDateString('it-IT', {
                  month: 'long',
                  year: 'numeric',
                })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* New Booking Form */}
      <BookingForm userId={userId} onBookingCreated={handleBookingCreated} />

      {/* Bookings Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          📌 Le Tue Prenotazioni Future
        </h2>
        {loading ? (
          <p className="text-slate-500">Caricamento...</p>
        ) : (
          <UserBookingList
            bookings={userBookings}
            onDelete={handleDeleteBooking}
            showDelete={true}
          />
        )}
      </div>
    </div>
  );
}
