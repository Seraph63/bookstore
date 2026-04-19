"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BookForm from '@/components/admin/BookForm';
import Navbar from '@/components/layout/Navbar';

export default function EditBookPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params?.id as string;
  const [user, setUser] = useState<any>(null);
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Carica l'utente dal localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      // Verifica se l'utente è admin
      if (userData.ruolo !== 'ADMIN') {
        router.push('/');
        return;
      }
    } else {
      router.push('/login');
      return;
    }

    if (bookId) {
      fetchBook();
    }
  }, [bookId, router]);

  const handleLogout = () => {
    document.cookie = "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem('user');
    router.push('/login');
  };

  const fetchBook = async () => {
    try {
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
      <>
        <Navbar user={user} onLogout={handleLogout} />
        <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento libro...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !book) {
    return (
      <>
        <Navbar user={user} onLogout={handleLogout} />
        <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-lg">{error}</p>
            <button 
              onClick={() => window.history.back()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Torna indietro
            </button>
          </div>
        </div>
      </>
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
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="min-h-screen bg-gray-50 py-8">
        <BookForm 
          mode="edit" 
          bookId={Number(bookId)}
          initialData={initialData}
          authorName={`${book.nomeAutore || ''} ${book.cognomeAutore || ''}`.trim()}
          publisherName={book.nomeEditore || ''}
        />
      </div>
    </>
  );
}