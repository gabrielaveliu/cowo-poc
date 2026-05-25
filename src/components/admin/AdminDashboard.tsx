'use client';

import { useState } from 'react';
import PricingManager from './PricingManager';
import BillingReport from './BillingReport';
import AdminBookingOverview from './AdminBookingOverview';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'billing'>('overview');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-1">Pannello Amministrazione</h1>
        <p className="text-orange-100">Gestisci sale, prezzi e fatturazione</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-slate-100 rounded-lg p-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded font-semibold transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-orange-600 shadow'
              : 'bg-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          📅 Prenotazioni
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2 rounded font-semibold transition-colors ${
            activeTab === 'pricing'
              ? 'bg-white text-orange-600 shadow'
              : 'bg-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          💰 Prezzi
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-2 rounded font-semibold transition-colors ${
            activeTab === 'billing'
              ? 'bg-white text-orange-600 shadow'
              : 'bg-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          📊 Fatturazione
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <AdminBookingOverview />}
      {activeTab === 'pricing' && <PricingManager />}
      {activeTab === 'billing' && <BillingReport />}
    </div>
  );
}
