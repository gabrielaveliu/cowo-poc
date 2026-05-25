'use client';

import { useState, useEffect } from 'react';
import { Booking, Room } from '@/types';
import { ROOMS } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  calculateBookingCost,
  isTimeSlotAvailable,
  getAvailableMonths,
  getCurrentMonthPricing,
} from '@/lib/utils';
import { apiClient } from '@/lib/api';

interface BookingFormProps {
  userId: string;
  onBookingCreated?: (booking: Booking) => void;
}

export default function BookingForm({
  userId,
  onBookingCreated,
}: BookingFormProps) {
  const [selectedRoom, setSelectedRoom] = useState<string>('room-1');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('10:00');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number>(0);

  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    // Calculate estimated cost
    const pricing = getCurrentMonthPricing();
    const cost = calculateBookingCost(selectedRoom, startTime, endTime, pricing);
    setEstimatedCost(cost);
  }, [selectedRoom, startTime, endTime]);

  const getMaxDate = (): string => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  const getTodayDate = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      // Validation
      if (!selectedDate || !startTime || !endTime) {
        throw new Error('Tutti i campi sono obbligatori');
      }

      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      if (endMinutes <= startMinutes) {
        throw new Error('L\'ora di fine deve essere successiva all\'ora di inizio');
      }

      // Check availability
      const available = isTimeSlotAvailable(
        selectedRoom,
        selectedDate,
        startTime,
        endTime
      );

      if (!available) {
        throw new Error('Questo orario non è disponibile per la sala selezionata');
      }

      // Create booking
      const newBooking = await apiClient.createBooking({
        userId,
        roomId: selectedRoom,
        date: selectedDate,
        startTime,
        endTime,
      });
      setMessage({
        type: 'success',
        text: `Prenotazione confermata! Costo: €${newBooking.cost.toFixed(2)}`,
      });

      // Reset form
      setStartTime('09:00');
      setEndTime('10:00');
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);

      if (onBookingCreated) {
        onBookingCreated(newBooking);
      }

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Errore sconosciuto',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 border border-slate-200">
      <h2 className="text-3xl font-bold mb-8 text-slate-800">📅 Nuova Prenotazione</h2>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg font-medium ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Room Selection */}
        <div className="space-y-2">
          <Label htmlFor="room" className="text-slate-700 font-semibold">
            Sala
          </Label>
          <Select value={selectedRoom} onValueChange={(value) => setSelectedRoom(value || 'room-1')}>
            <SelectTrigger id="room" className="text-slate-700">
              <SelectValue placeholder="Seleziona una sala" />
            </SelectTrigger>
            <SelectContent>
              {ROOMS.map((room: Room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name} ({room.capacity} posti)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Selection */}
        <div className="space-y-2">
          <Label htmlFor="date" className="text-slate-700 font-semibold">
            Data
          </Label>
          <Input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={getTodayDate()}
            max={getMaxDate()}
            className="text-slate-700 font-medium"
            required
          />
        </div>

        {/* Start Time */}
        <div className="space-y-2">
          <Label htmlFor="startTime" className="text-slate-700 font-semibold">
            Ora Inizio
          </Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="text-slate-700 font-medium"
            required
          />
        </div>

        {/* End Time */}
        <div className="space-y-2">
          <Label htmlFor="endTime" className="text-slate-700 font-semibold">
            Ora Fine
          </Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="text-slate-700 font-medium"
            required
          />
        </div>
      </div>

      {/* Estimated Cost */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 rounded-lg p-6 mb-8">
        <p className="text-sm text-slate-600 font-medium">Costo Stimato</p>
        <p className="text-4xl font-bold text-blue-700">€ {estimatedCost.toFixed(2)}</p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg rounded-lg"
      >
        {loading ? '⏳ Elaborazione...' : '✓ Conferma Prenotazione'}
      </Button>
    </form>
  );
}
