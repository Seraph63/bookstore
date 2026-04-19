"use client";
import { BookOpenIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

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

interface BooksStatsProps {
  books: Book[];
  loading?: boolean;
}

export default function BooksStats({ books, loading = false }: BooksStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  const totalBooks = books.length;
  const availableBooks = books.filter(book => book.stock > 0).length;
  const outOfStockBooks = books.filter(book => book.stock === 0).length;
  const totalValue = books.reduce((sum, book) => sum + (book.prezzo * book.stock), 0);

  const stats = [
    {
      id: 'total',
      name: 'Totale Libri',
      value: totalBooks,
      icon: BookOpenIcon,
      color: 'blue',
      change: `${totalBooks} titoli nel catalogo`
    },
    {
      id: 'available',
      name: 'Disponibili',
      value: availableBooks,
      icon: CheckCircleIcon,
      color: 'green',
      change: `${((availableBooks / Math.max(totalBooks, 1)) * 100).toFixed(1)}% del catalogo`
    },
    {
      id: 'out-of-stock',
      name: 'Esauriti',
      value: outOfStockBooks,
      icon: XCircleIcon,
      color: 'red',
      change: outOfStockBooks > 0 ? 'Necessario rifornimento' : 'Tutti i libri disponibili'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          text: 'text-blue-600',
          bg: 'bg-blue-100',
          border: 'border-blue-200'
        };
      case 'green':
        return {
          text: 'text-green-600',
          bg: 'bg-green-100',
          border: 'border-green-200'
        };
      case 'red':
        return {
          text: 'text-red-600',
          bg: 'bg-red-100',
          border: 'border-red-200'
        };
      default:
        return {
          text: 'text-gray-600',
          bg: 'bg-gray-100',
          border: 'border-gray-200'
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => {
        const colors = getColorClasses(stat.color);
        return (
          <div key={stat.id} className={`bg-white rounded-lg shadow-sm border ${colors.border} p-6 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className={`text-3xl font-bold ${colors.text}`}>{stat.value.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`${colors.bg} p-3 rounded-full`}>
                <stat.icon className={`w-6 h-6 ${colors.text}`} />
              </div>
            </div>
          </div>
        );
      })}

      {/* Statistica aggiuntiva per il valore totale inventario */}
      <div className="md:col-span-3">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Valore Totale Inventario</p>
              <p className="text-3xl font-bold">€{totalValue.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
              <p className="text-purple-100 text-xs mt-1">
                Basato su {books.reduce((sum, book) => sum + book.stock, 0)} unità in magazzino
              </p>
            </div>
            <div className="bg-purple-400 p-3 rounded-full bg-opacity-50">
              <BookOpenIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}