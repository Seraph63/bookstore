"use client";
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <h1 className="text-2xl font-bold text-blue-600 italic tracking-tight">BookStore</h1>

      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 p-1 pr-3 hover:bg-gray-100 rounded-full transition text-gray-600 border border-transparent hover:border-gray-200"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <UserCircleIcon className="w-8 h-8" />
          </div>
          <span className="font-semibold">{user?.nome} {user?.cognome}</span>
        </button>

        {showDropdown && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded-2xl shadow-2xl z-20 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-3 border-b bg-gray-50">
                <p className="text-sm font-bold text-gray-900">{user?.nome} {user?.cognome}</p>
              </div>
              <button 
                disabled={user?.isGuest}
                className={`w-full text-left px-4 py-3 text-sm flex items-center ${user?.isGuest ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <span className="mr-3">👤</span> Profilo Utente {user?.isGuest && "(Registrati)"}
              </button>
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center font-bold"
              >
                <span className="mr-3">🚪</span> Esci
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}