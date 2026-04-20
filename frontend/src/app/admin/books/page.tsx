"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import BooksStats from '@/components/admin/BooksStats';
import BooksTable from '@/components/admin/BooksTable';

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

export default function AdminBooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchBooks();

    // Ascolta l'evento di aggiornamento stock post-checkout
    const handleStockUpdate = () => {
      console.log('Stock aggiornato in admin, ricarico libri...');
      fetchBooks();
    };

    window.addEventListener('booksStockUpdated', handleStockUpdate);

    // Cleanup dell'event listener
    return () => {
      window.removeEventListener('booksStockUpdated', handleStockUpdate);
    };
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:8080/api/books?page=0&size=100'); // Carica tutti i libri per admin
      if (!response.ok) {
        throw new Error('Errore caricamento libri');
      }
      const data = await response.json();
      setBooks(data.content || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId: number): Promise<void> => {
    const response = await fetch(`http://localhost:8080/api/books/${bookId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Errore eliminazione libro');
    }

    // Rimuovi il libro dalla lista locale
    setBooks(prev => prev.filter(book => book.id !== bookId));
    
    // Mostra messaggio di successo
    toast.success('Libro eliminato con successo!');
  };

  if (error) {
    return (
      <div className="py-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchBooks}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestione Libri</h1>
            <p className="text-gray-600 mt-2">Gestisci il catalogo dei libri del tuo negozio</p>
          </div>
          <button
            onClick={() => router.push('/admin/books/create')}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
          >
            <PlusIcon className="w-5 h-5" />
            Nuovo Libro
          </button>
        </div>

        {/* Stats */}
        <BooksStats books={books} loading={loading} />

        {/* Table */}
        <BooksTable 
          books={books} 
          loading={loading} 
          onDelete={handleDelete}
          onRefresh={fetchBooks}
        />
      </div>
    </div>
  );
}