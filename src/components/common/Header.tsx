'use client';

import { useState, useEffect } from 'react';
import { UserRole } from '@/types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export default function Header({ currentRole, onRoleChange }: HeaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold">🏢 Coworking Meeting Rooms</div>
          <span className="text-sm text-slate-300">POC Demo</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2 bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => onRoleChange('user')}
              className={`px-4 py-2 rounded transition-colors font-medium text-sm ${
                currentRole === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-transparent text-slate-300 hover:text-white'
              }`}
            >
              👤 Utente
            </button>
            <button
              onClick={() => onRoleChange('admin')}
              className={`px-4 py-2 rounded transition-colors font-medium text-sm ${
                currentRole === 'admin'
                  ? 'bg-orange-600 text-white'
                  : 'bg-transparent text-slate-300 hover:text-white'
              }`}
            >
              ⚙️ Admin
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
