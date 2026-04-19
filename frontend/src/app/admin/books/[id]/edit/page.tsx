"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BookForm from '@/components/admin/BookForm';

export default function EditBookPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params?.id as string;
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // L'autenticazione admin è gestita dal layout admin
    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`http://localhost:8080/api/books/${bookId}`);
      if (!response.ok) {
        throw new Error('Libro non trovato');
      }
      const bookData = await response.json();
      setBook(bookData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore caricamento libro');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento libro...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error || 'Libro non trovato'}</p>
            <button 
              onClick={() => router.push('/admin/books')} 
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Torna alla gestione libri
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Prepara i dati per il form, mappando da BookResponse a BookFormData
  const initialData = {
    titolo: book.titolo || '',
    sottotitolo: book.sottotitolo || '',
    autoreId: book.autoreId || null, // ID diretto dal BookResponse
    editoreId: book.editoreId || null, // ID diretto dal BookResponse
    annoPubblicazione: book.annoPubblicazione || '',
    isbn10: book.isbn10 || '',
    isbn13: book.isbn13 || '',
    formati: book.formati || '',
    prezzo: book.prezzo || '',
    prezzoOriginale: book.prezzoOriginale || '',
    stock: book.stock || '',
    copertinaUrl: book.copertinaUrl || '',
    categoria: book.categoria || '',
    tags: book.tags || '',
    descrizione: book.descrizione || ''
  };

  return (
    <div className="py-8">
      <BookForm 
        mode="edit" 
        bookId={Number(bookId)}
        initialData={initialData}
        authorName={`${book.nomeAutore || ''} ${book.cognomeAutore || ''}`.trim()}
        publisherName={book.nomeEditore || ''}
      />
    </div>
  );
}