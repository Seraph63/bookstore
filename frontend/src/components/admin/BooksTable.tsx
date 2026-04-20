"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

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

interface BooksTableProps {
  books: Book[];
  loading?: boolean;
  onDelete?: (bookId: number) => Promise<void>;
  onRefresh?: () => void;
}

export default function BooksTable({ books, loading = false, onDelete, onRefresh }: BooksTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (bookId: number) => {
    if (!onDelete) return;
    
    if (!confirm('Sei sicuro di voler eliminare questo libro? Questa azione non può essere annullata.')) {
      return;
    }

    try {
      setDeletingId(bookId);
      await onDelete(bookId);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Errore eliminazione libro');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="animate-pulse">
          <div className="bg-gray-50 px-6 py-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-gray-200 px-6 py-4">
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Libro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Autore
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Editore
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Anno
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prezzo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={book.titolo}>
                      {book.titolo}
                    </div>
                    {book.sottotitolo && (
                      <div className="text-sm text-gray-500 max-w-xs truncate" title={book.sottotitolo}>
                        {book.sottotitolo}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {book.nomeAutore} {book.cognomeAutore}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 max-w-xs truncate" title={book.nomeEditore}>
                    {book.nomeEditore}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{book.annoPubblicazione || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">€{book.prezzo?.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    book.stock > 10
                      ? 'bg-green-100 text-green-800'
                      : book.stock > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.stock > 0 ? `${book.stock} disponibili` : 'Esaurito'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 max-w-xs truncate" title={book.categoria || '-'}>
                    {book.categoria || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => router.push(`/admin/books/${book.id}`)}
                      className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Visualizza dettagli"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/admin/books/${book.id}/edit`)}
                      className="text-amber-600 hover:text-amber-900 p-2 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Modifica"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    {onDelete && (
                      <button
                        onClick={() => handleDelete(book.id)}
                        disabled={deletingId === book.id}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Elimina"
                      >
                        {deletingId === book.id ? (
                          <div className="w-4 h-4 animate-spin border-2 border-red-600 border-t-transparent rounded-full"></div>
                        ) : (
                          <TrashIcon className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {books.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <EyeIcon className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500 text-lg mb-4">Nessun libro trovato</p>
          <button
            onClick={() => router.push('/admin/books/create')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Aggiungi il primo libro
          </button>
        </div>
      )}
    </div>
  );
}