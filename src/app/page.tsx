'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import UserDashboard from '@/components/user/UserDashboard';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { UserRole } from '@/types';

export default function Home() {
  const [currentRole, setCurrentRole] = useState<UserRole>('user');
  const [currentUserId, setCurrentUserId] = useState<string>('user-1');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Header currentRole={currentRole} onRoleChange={setCurrentRole} />
      <main className="bg-slate-50 min-h-screen">
        {currentRole === 'user' && (
          <>
            <div className="bg-blue-50 border-b border-blue-200 px-4 py-3 max-w-7xl mx-auto">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-blue-900">
                  Utente
                </label>
                <select
                  value={currentUserId}
                  onChange={(e) => setCurrentUserId(e.target.value)}
                  className="px-3 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="user-1">Alice Rossi</option>
                  <option value="user-2">Bob Bianchi</option>
                  <option value="user-3">Carlo Verdi</option>
                </select>
              </div>
            </div>
            <UserDashboard userId={currentUserId} />
          </>
        )}
        {currentRole === 'admin' && <AdminDashboard />}
      </main>
    </>
  );
}
