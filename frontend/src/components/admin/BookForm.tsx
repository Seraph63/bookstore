"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface BookFormProps {
  mode: 'create' | 'edit';
  bookId?: number | string;
  initialData?: any;
  authorName?: string;
  publisherName?: string;
}

interface Author {
  id: number;
  nome: string;
  cognome: string;
}

interface Publisher {
  id: number;
  nome: string;
  sede: string;
}

interface FormData {
  titolo: string;
  sottotitolo: string;
  autoreId: number | null;
  editoreId: number | null;
  annoPubblicazione: number;
  isbn10: string;
  isbn13: string;
  formati: string;
  prezzo: number;
  prezzoOriginale: number;
  stock: number;
  copertinaUrl: string;
  categoria: string;
  tags: string;
  descrizione: string;
}

export default function BookForm({ mode, bookId, initialData }: BookFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const [formData, setFormData] = useState<FormData>({
    titolo: '',
    sottotitolo: '',
    autoreId: null,
    editoreId: null,
    annoPubblicazione: new Date().getFullYear(),
    isbn10: '',
    isbn13: '',
    formati: 'Cartaceo',
    prezzo: 0,
    prezzoOriginale: 0,
    stock: 0,
    copertinaUrl: '',
    categoria: '',
    tags: '',
    descrizione: ''
  });

  useEffect(() => {
    // Carica autori e editori
    loadAuthorsAndPublishers();
  }, []);

  useEffect(() => {
    if (mode === 'edit' && initialData && !loadingData) {
      // Aspetta che autori e editori siano stati caricati prima di settare i dati
      console.log('Settaggio dati iniziali:', initialData);
      setFormData({
        titolo: initialData.titolo || '',
        sottotitolo: initialData.sottotitolo || '',
        autoreId: initialData.autoreId || null,
        editoreId: initialData.editoreId || null,
        annoPubblicazione: initialData.annoPubblicazione || new Date().getFullYear(),
        isbn10: initialData.isbn10 || '',
        isbn13: initialData.isbn13 || '',
        formati: initialData.formati || 'Cartaceo',
        prezzo: initialData.prezzo || 0,
        prezzoOriginale: initialData.prezzoOriginale || 0,
        stock: initialData.stock || 0,
        copertinaUrl: initialData.copertinaUrl || '',
        categoria: initialData.categoria || '',
        tags: initialData.tags || '',
        descrizione: initialData.descrizione || ''
      });
    }
  }, [mode, initialData, loadingData]); // Aggiunto loadingData come dipendenza

  const loadAuthorsAndPublishers = async () => {
    setLoadingData(true);
    try {
      const [authorsResponse, publishersResponse] = await Promise.all([
        fetch('http://localhost:8080/api/authors'),
        fetch('http://localhost:8080/api/publishers')
      ]);

      if (authorsResponse.ok) {
        const authorsData = await authorsResponse.json();
        setAuthors(authorsData);
      } else {
        console.error('Errore caricamento autori');
      }

      if (publishersResponse.ok) {
        const publishersData = await publishersResponse.json();
        setPublishers(publishersData);
      } else {
        console.error('Errore caricamento editori');
      }
    } catch (error) {
      console.error('Errore durante il caricamento:', error);
      setError('Errore durante il caricamento degli autori e editori');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'prezzo' || name === 'prezzoOriginale' || name === 'annoPubblicazione' || name === 'stock' 
        ? Number(value) 
        : name === 'autoreId' || name === 'editoreId'
        ? value === '' ? null : Number(value)
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Tentativo di salvataggio libro:', {
      mode,
      bookId,
      formData
    });

    try {
      const url = mode === 'create' 
        ? 'http://localhost:8080/api/books'
        : `http://localhost:8080/api/books/${bookId}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      console.log(`${method} ${url}`, formData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Risposta server:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('Salvataggio riuscito:', result);
        
        // Mostra messaggio di successo
        toast.success(
          mode === 'create' 
            ? 'Libro creato con successo!' 
            : 'Libro modificato con successo!'
        );
        
        // Attendi un momento per permettere di vedere il toast
        setTimeout(() => {
          router.push('/admin/books');
          router.refresh();
        }, 1500);
      } else {
        const errorData = await response.text();
        console.error('Errore dal server:', errorData);
        const errorMessage = errorData || `Errore ${response.status}: ${response.statusText}`;
        setError(errorMessage);
        toast.error(`Errore nel salvataggio: ${errorMessage}`);
      }
    } catch (err) {
      console.error('Errore di rete:', err);
      const errorMessage = 'Errore di connessione al server';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Inserisci Nuovo Libro' : 'Modifica Libro'}
          </h1>
          <button
            onClick={() => router.push('/admin/books')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Indietro
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loadingData ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Caricamento dati...</p>
          </div>
        ) : (

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informazioni Base */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informazioni Base</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titolo *
            </label>
            <input
              type="text"
              name="titolo"
              value={formData.titolo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sottotitolo
            </label>
            <input
              type="text"
              name="sottotitolo"
              value={formData.sottotitolo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Autore */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Autore</h3>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleziona Autore *
            </label>
            <select
              name="autoreId"
              value={formData.autoreId || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Seleziona un autore --</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.nome} {author.cognome}
                </option>
              ))}
            </select>
          </div>

          {/* Editore */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Editore</h3>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleziona Editore *
            </label>
            <select
              name="editoreId"
              value={formData.editoreId || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Seleziona un editore --</option>
              {publishers.map((publisher) => (
                <option key={publisher.id} value={publisher.id}>
                  {publisher.nome} ({publisher.sede})
                </option>
              ))}
            </select>
          </div>

          {/* Dettagli Pubblicazione */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dettagli Pubblicazione</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anno Pubblicazione *
            </label>
            <input
              type="number"
              name="annoPubblicazione"
              value={formData.annoPubblicazione}
              onChange={handleChange}
              required
              min="1900"
              max={new Date().getFullYear() + 10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <input
              type="text"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="es. Narrativa, Saggistica, Fantasy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ISBN-10
            </label>
            <input
              type="text"
              name="isbn10"
              value={formData.isbn10}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="es. 8845207056"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ISBN-13 *
            </label>
            <input
              type="text"
              name="isbn13"
              value={formData.isbn13}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="es. 978-8845207051"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formati
            </label>
            <input
              type="text"
              name="formati"
              value={formData.formati}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="es. Cartaceo|E-book|Audiobook"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="es. Storico|Mistero"
            />
          </div>

          {/* Prezzo e Stock */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prezzo e Disponibilità</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prezzo (€) *
            </label>
            <input
              type="number"
              name="prezzo"
              value={formData.prezzo}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prezzo Originale (€)
            </label>
            <input
              type="number"
              name="prezzoOriginale"
              value={formData.prezzoOriginale}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Copertina
            </label>
            <input
              type="url"
              name="copertinaUrl"
              value={formData.copertinaUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="es. https://picsum.photos/seed/1/400/600"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrizione
            </label>
            <textarea
              name="descrizione"
              value={formData.descrizione}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Inserisci una descrizione del libro..."
            />
          </div>

          <div className="md:col-span-2 flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex-1 max-w-xs"
            >
              {loading ? 'Salvando...' : (mode === 'create' ? 'Crea Libro' : 'Salva Modifiche')}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/books')}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 flex-1 max-w-xs"
            >
              Annulla
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}