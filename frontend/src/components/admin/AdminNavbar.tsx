"use client";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  UserCircleIcon, 
  BookOpenIcon, 
  ChartBarIcon, 
  UsersIcon,
  HomeIcon,
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { useState } from 'react';

interface User {
  nome: string;
  cognome: string;
  ruolo: string;
}

interface AdminNavbarProps {
  user: User;
  onLogout: () => void;
}

export default function AdminNavbar({ user, onLogout }: AdminNavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: ChartBarIcon, current: pathname === '/admin' },
    { name: 'Gestione Libri', href: '/admin/books', icon: BookOpenIcon, current: pathname.startsWith('/admin/books') },
    { name: 'Utenti', href: '/admin/users', icon: UsersIcon, current: pathname.startsWith('/admin/users') },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center">
              <Link href="/admin" className="flex items-center">
                <span className="text-2xl font-bold text-purple-600 italic tracking-tight">
                  BookStore
                </span>
                <span className="ml-2 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                  Admin
                </span>
              </Link>
            </div>

            {/* Navigation menu */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors ${
                    item.current
                      ? 'border-purple-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Torna al sito */}
            <Link
              href="/"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <HomeIcon className="mr-1 h-4 w-4" />
              Torna al sito
            </Link>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-1 pr-3 hover:bg-gray-100 rounded-lg transition text-gray-600 border border-transparent hover:border-gray-200"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <UserCircleIcon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {user.nome} {user.cognome}
                  </div>
                  <div className="text-xs text-gray-500">Amministratore</div>
                </div>
              </button>

              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20 py-1 overflow-hidden">
                    <div className="px-4 py-3 border-b bg-gray-50">
                      <p className="text-sm font-medium text-gray-900">{user.nome} {user.cognome}</p>
                      <p className="text-xs text-purple-600 font-medium">Amministratore</p>
                    </div>
                    
                    <Link
                      href="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Profilo
                    </Link>
                    
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                    >
                      <ArrowLeftOnRectangleIcon className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="space-y-1 pb-3 pt-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors ${
                item.current
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}