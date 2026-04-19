"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PencilSquareIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

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
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!book || !confirm('Sei sicuro di voler eliminare questo libro? Questa azione non può essere annullata.')) {
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

      toast.success('Libro eliminato con successo!');
      
      // Attendi un momento per permettere di vedere il toast
      setTimeout(() => {
        router.push('/admin/books');
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore eliminazione libro';
      toast.error(`Errore: ${errorMessage}`);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="aspect-[3/4] bg-gray-200 rounded-lg"></div>
                </div>
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error || 'Libro non trovato'}</p>
            <button 
              onClick={() => router.push('/admin/books')} 
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Torna alla lista libri
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/admin/books')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Torna alla gestione libri
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/admin/books/${bookId}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
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

        {/* Book Details Card */}
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
                    <span className="inline-flex px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full">
                      {book.categoria}
                    </span>
                  </div>
                )}

                {book.descrizione && (
                  <div className="prose prose-sm text-gray-700 mb-6">
                    <p>{book.descrizione}</p>
                  </div>
                )}
              </div>

              {/* Pricing and Stock Info */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Prezzo</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        €{book.prezzo?.toFixed(2)}
                      </span>
                      {book.prezzoOriginale && book.prezzoOriginale !== book.prezzo && (
                        <>
                          <span className="text-lg text-gray-500 line-through">
                            €{book.prezzoOriginale.toFixed(2)}
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            -{book.percentualeSconto}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Disponibilità</h3>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        book.stock > 10
                          ? 'bg-green-100 text-green-800'
                          : book.stock > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {book.stock > 0 ? `${book.stock} disponibili` : 'Esaurito'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {(book.isbn10 || book.isbn13 || book.formati) && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Dettagli Tecnici</h3>
                  <dl className="space-y-2">
                    {book.isbn10 && (
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">ISBN-10:</dt>
                        <dd className="text-sm text-gray-900">{book.isbn10}</dd>
                      </div>
                    )}
                    {book.isbn13 && (
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">ISBN-13:</dt>
                        <dd className="text-sm text-gray-900">{book.isbn13}</dd>
                      </div>
                    )}
                    {book.formati && (
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Formato:</dt>
                        <dd className="text-sm text-gray-900">{book.formati}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}