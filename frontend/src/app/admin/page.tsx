"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpenIcon, UserIcon, ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import BooksStats from '@/components/admin/BooksStats';

interface Book {
  id: number;
  titolo: string;
  sottotitolo?: string;
  nomeAutore: string;
  cognomeAutore: string;
  nomeEditore: string;
  annoPubblicazione?: number;
  prezzo: number;
  stock: number;
  categoria?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // L'autenticazione admin è gestita dal layout admin
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch books data
      const booksResponse = await fetch('http://localhost:8080/api/books?page=0&size=1000');
      if (booksResponse.ok) {
        const booksData = await booksResponse.json();
        setBooks(booksData.content || []);
      }

      // TODO: Implement other stats endpoints when available
      // For now, we'll use placeholder data
      setStats({
        totalBooks: books.length,
        totalUsers: 150, // Placeholder
        totalOrders: 89, // Placeholder
        totalRevenue: 12450.00 // Placeholder
      });
      
    } catch (error) {
      console.error('Errore caricamento dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      name: 'Aggiungi Libro',
      description: 'Aggiungi un nuovo libro al catalogo',
      href: '/admin/books/create',
      icon: BookOpenIcon,
      color: 'purple'
    },
    {
      name: 'Gestione Libri',
      description: 'Visualizza e modifica tutti i libri',
      href: '/admin/books',
      icon: BookOpenIcon,
      color: 'blue'
    },
    {
      name: 'Gestione Utenti',
      description: 'Gestisci gli utenti registrati',
      href: '/admin/users',
      icon: UserIcon,
      color: 'green'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
      case 'blue':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'green':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
    }
  };

  const recentActivity = [
    {
      id: 1,
      action: 'Nuovo libro aggiunto',
      details: 'Il Grande Gatsby - F. Scott Fitzgerald',
      time: '2 ore fa',
      type: 'book'
    },
    {
      id: 2,
      action: 'Stock aggiornato',
      details: '1984 - George Orwell (+5 copie)',
      time: '5 ore fa',
      type: 'stock'
    },
    {
      id: 3,
      action: 'Nuovo utente registrato',
      details: 'Mario Rossi',
      time: '1 giorno fa',
      type: 'user'
    }
  ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">Panoramica generale del tuo bookstore</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Totale Libri</p>
                <p className="text-3xl font-bold text-gray-900">{books.length}</p>
                <p className="text-xs text-green-600 mt-1">+2 questo mese</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <BookOpenIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utenti Registrati</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-green-600 mt-1">+12 questo mese</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <UserIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ordini Totali</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                <p className="text-xs text-green-600 mt-1">+7 questo mese</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <ChartBarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ricavi</p>
                <p className="text-3xl font-bold text-gray-900">€{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">+€340 questo mese</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <ArrowTrendingUpIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Books Stats */}
        <BooksStats books={books} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Azioni Rapide</h2>
            <div className="space-y-4">
              {quickActions.map((action) => (
                <button
                  key={action.name}
                  onClick={() => router.push(action.href)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${getColorClasses(action.color)}`}
                >
                  <div className="flex items-center">
                    <action.icon className="w-6 h-6 mr-3" />
                    <div>
                      <h3 className="font-medium">{action.name}</h3>
                      <p className="text-sm opacity-80">{action.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Attività Recente</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'book' ? 'bg-purple-500' :
                    activity.type === 'stock' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}