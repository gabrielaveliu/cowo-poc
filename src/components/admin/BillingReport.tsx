'use client';

import { useState, useEffect } from 'react';
import { MonthlyBillingReport } from '@/types';
import { getAvailableMonths } from '@/lib/utils';
import { apiClient } from '@/lib/api';

export default function BillingReport() {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [report, setReport] = useState<MonthlyBillingReport[]>([]);
  const [loading, setLoading] = useState(false);

  const availableMonths = getAvailableMonths();

  useEffect(() => {
    if (availableMonths.length > 0) {
      setSelectedMonth(availableMonths[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      fetchReport();
    }
  }, [selectedMonth]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getBillingReport(selectedMonth);
      setReport(data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = report.reduce((sum, r) => sum + r.totalCost, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">📊 Fatturazione Mensile</h2>

      {/* Month Selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Mese
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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

      {/* Total Revenue Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 mb-6">
        <p className="text-sm opacity-90">Ricavi Totali Mese</p>
        <p className="text-4xl font-bold">€ {totalRevenue.toFixed(2)}</p>
      </div>

      {/* Report Table */}
      {loading ? (
        <p className="text-slate-500">Caricamento...</p>
      ) : report.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p>Nessun dato di fatturazione per questo mese.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 border-b-2 border-slate-300">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-800">
                  Utente
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-800">
                  Email
                </th>
                <th className="px-4 py-3 text-center font-semibold text-slate-800">
                  Prenotazioni
                </th>
                <th className="px-4 py-3 text-right font-semibold text-slate-800">
                  Importo (€)
                </th>
              </tr>
            </thead>
            <tbody>
              {report.map((entry) => (
                <tr
                  key={entry.userId}
                  className="border-b border-slate-200 hover:bg-slate-50 transition"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {entry.userName}
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">
                    {entry.userEmail}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {entry.bookings.length}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-green-600">
                    € {entry.totalCost.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 border-t-2 border-slate-300">
              <tr>
                <td colSpan={3} className="px-4 py-3 font-bold text-slate-800 text-right">
                  TOTALE:
                </td>
                <td className="px-4 py-3 text-right font-bold text-lg text-green-600">
                  € {totalRevenue.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Export Button */}
      <button
        onClick={() => {
          const csv = [
            ['Utente', 'Email', 'Prenotazioni', 'Importo (€)'],
            ...report.map((r) => [
              r.userName,
              r.userEmail,
              r.bookings.length,
              r.totalCost.toFixed(2),
            ]),
          ]
            .map((row) => row.join(','))
            .join('\n');

          const blob = new Blob([csv], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `fatturazione-${selectedMonth}.csv`;
          a.click();
        }}
        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors"
      >
        📥 Esporta CSV
      </button>
    </div>
  );
}
