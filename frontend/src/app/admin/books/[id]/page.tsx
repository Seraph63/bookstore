"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { PencilSquareIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface Book {
  id: number;
  titolo: string;
  sottotitolo?: string;
  nomeAutore: string;
  cognomeAutore: string;
  nomeEditore: string;
  annoPubblicazione?: number;
  isbn10?: string;
  isbn13?: string;
  formati?: string;
  prezzo: number;
  prezzoOriginale?: number;
  stock: number;
  copertinaUrl?: string;
  categoria?: string;
  tags?: string;
  descrizione?: string;
  percentualeSconto?: number;
  disponibile: boolean;
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params?.id as string;
  const [user, setUser] = useState<any>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!confirm('Sei sicuro di voler eliminare questo libro? Questa azione non può essere annullata.')) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(`http://localhost:8080/api/books/${bookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Errore eliminazione libro');
      }

      router.push('/admin/books');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore eliminazione libro');
    } finally {
      setDeleting(false);
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
              onClick={() => router.back()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Torna indietro
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Torna indietro
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/admin/books/${bookId}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                <PencilSquareIcon className="w-5 h-5" />
                Modifica
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
                {deleting ? 'Eliminazione...' : 'Elimina'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
              {/* Copertina */}
              <div className="lg:col-span-1">
                <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={book.copertinaUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"}
                    alt={book.titolo}
                    className="w-full h-full object-cover"
                    onError={(e) => { 
                      e.currentTarget.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"; 
                    }}
                  />
                </div>
              </div>

              {/* Informazioni principali */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.titolo}</h1>
                  {book.sottotitolo && (
                    <h2 className="text-xl text-gray-600 mb-4">{book.sottotitolo}</h2>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <span>di <strong>{book.nomeAutore} {book.cognomeAutore}</strong></span>
                    <span>•</span>
                    <span>Editore: <strong>{book.nomeEditore}</strong></span>
                    {book.annoPubblicazione && (
                      <>
                        <span>•</span>
                        <span>Anno: <strong>{book.annoPubblicazione}</strong></span>
                      </>
                    )}
                  </div>

                  {book.categoria && (
                    <div className="mb-4">
                      <span className="inline-flex px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                        {book.categoria}
                      </span>
                    </div>
                  )}
                </div>

                {/* Prezzo e disponibilità */}
                <div className="border-t pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold text-gray-900">€{book.prezzo.toFixed(2)}</span>
                    {book.prezzoOriginale && book.prezzoOriginale > book.prezzo && (
                      <>
                        <span className="text-lg text-gray-500 line-through">€{book.prezzoOriginale.toFixed(2)}</span>
                        {book.percentualeSconto && (
                          <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                            -{book.percentualeSconto.toFixed(0)}%
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      book.disponibile 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {book.disponibile ? `${book.stock} disponibili` : 'Non disponibile'}
                    </span>

                    {book.formati && (
                      <span className="text-sm text-gray-600">
                        Formati: {book.formati}
                      </span>
                    )}
                  </div>
                </div>

                {/* Descrizione */}
                {book.descrizione && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Descrizione</h3>
                    <p className="text-gray-700 leading-relaxed">{book.descrizione}</p>
                  </div>
                )}

                {/* Tags */}
                {book.tags && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {book.tags.split(',').map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dettagli tecnici */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Dettagli</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {book.isbn10 && (
                      <div>
                        <span className="font-medium text-gray-700">ISBN-10:</span>
                        <span className="ml-2 text-gray-600">{book.isbn10}</span>
                      </div>
                    )}
                    {book.isbn13 && (
                      <div>
                        <span className="font-medium text-gray-700">ISBN-13:</span>
                        <span className="ml-2 text-gray-600">{book.isbn13}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-700">ID Libro:</span>
                      <span className="ml-2 text-gray-600">{book.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}