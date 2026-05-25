'use client';

import { useState, useEffect } from 'react';
import { ROOMS } from '@/lib/mockData';
import { Room } from '@/types';
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
import { getAvailableMonths } from '@/lib/utils';
import { apiClient } from '@/lib/api';

interface PricingManagerProps {
  onPricingUpdated?: () => void;
}

export default function PricingManager({ onPricingUpdated }: PricingManagerProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [pricing, setPricing] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const availableMonths = getAvailableMonths();

  useEffect(() => {
    if (availableMonths.length > 0) {
      setSelectedMonth(availableMonths[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      fetchPricing();
    }
  }, [selectedMonth]);

  const fetchPricing = async () => {
    try {
      const data = await apiClient.getPricing(selectedMonth);
      setPricing(data);
    } catch (error) {
      console.error('Error fetching pricing:', error);
    }
  };

  const handlePriceChange = (roomId: string, newPrice: number) => {
    setPricing((prev) => ({
      ...prev,
      [roomId]: newPrice,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      await apiClient.updatePricing(selectedMonth, pricing);

      setMessage({
        type: 'success',
        text: 'Prezzi aggiornati con successo!',
      });

      if (onPricingUpdated) {
        onPricingUpdated();
      }

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

  const colorMap: Record<string, string> = {
    red: 'bg-red-100 border-red-300',
    green: 'bg-green-100 border-green-300',
    blue: 'bg-blue-100 border-blue-300',
  };

  const iconMap: Record<string, string> = {
    red: '🔴',
    green: '🟢',
    blue: '🔵',
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border border-slate-200">
      <h2 className="text-3xl font-bold mb-8 text-slate-800">💰 Gestione Prezzi Orari</h2>

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

      {/* Month Selector */}
      <div className="mb-8 max-w-md">
        <Label htmlFor="month-select" className="text-slate-700 font-semibold mb-2 block">
          Mese
        </Label>
        <Select value={selectedMonth} onValueChange={(value) => setSelectedMonth(value || '')}>
          <SelectTrigger id="month-select" className="text-slate-700">
            <SelectValue placeholder="Seleziona mese" />
          </SelectTrigger>
          <SelectContent>
            {availableMonths.map((month) => (
              <SelectItem key={month} value={month}>
                {new Date(`${month}-01`).toLocaleDateString('it-IT', {
                  month: 'long',
                  year: 'numeric',
                })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {ROOMS.map((room: Room) => {
          const colorClass = colorMap[room.color];
          const icon = iconMap[room.color];

          return (
            <div key={room.id} className={`border rounded-lg p-6 ${colorClass} shadow-sm`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">{icon}</span>
                <h3 className="font-bold text-slate-800 text-lg">{room.name}</h3>
              </div>
              <p className="text-sm text-slate-700 font-medium mb-4">{room.capacity} posti</p>
              <div className="space-y-2">
                <Label htmlFor={`price-${room.id}`} className="text-slate-700 font-semibold text-sm">
                  Prezzo/ora
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-700">€</span>
                  <Input
                    id={`price-${room.id}`}
                    type="number"
                    min="1"
                    max="500"
                    step="5"
                    value={pricing[room.id] || 0}
                    onChange={(e) =>
                      handlePriceChange(room.id, parseFloat(e.target.value))
                    }
                    className="flex-1 text-slate-700 font-semibold text-lg"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 text-lg"
      >
        {loading ? '⏳ Salvataggio...' : '💾 Salva Prezzi'}
      </Button>
    </div>
  );
}
