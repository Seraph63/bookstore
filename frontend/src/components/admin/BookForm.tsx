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

interface Category {
  id: number;
  descrizione: string;
}

interface Tag {
  id: number;
  descrizione: string;
}

interface Formato {
  id: number;
  descrizione: string;
}

interface FormData {
  titolo: string;
  sottotitolo: string;
  autoreId: number | null;
  editoreId: number | null;
  annoPubblicazione: number;
  isbn10: string;
  isbn13: string;
  formatoIds: number[];
  prezzo: number;
  prezzoOriginale: number;
  stock: number;
  copertinaUrl: string;
  categoriaId: number | null;
  tagIds: number[];
  descrizione: string;
}


export default function BookForm({ mode, bookId, initialData }: BookFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [formati, setFormati] = useState<Formato[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    titolo: '',
    sottotitolo: '',
    autoreId: null,
    editoreId: null,
    annoPubblicazione: new Date().getFullYear(),
    isbn10: '',
    isbn13: '',
    formatoIds: [],
    prezzo: 0,
    prezzoOriginale: 0,
    stock: 0,
    copertinaUrl: '',
    categoriaId: null,
    tagIds: [],
    descrizione: ''
  });

  useEffect(() => {
    // Carica autori e editori
    loadAuthorsAndPublishers();
  }, []);

  useEffect(() => {
    if (mode === 'edit' && initialData && !loadingData) {
      // Conversione tags string a tagIds array
      const parseTagIds = (tagsString: string): number[] => {
        if (!tagsString) return [];

        // Se sono descrizioni separate da virgola, trova gli ID corrispondenti
        const descriptions = tagsString.split(',').map(t => t.trim());
        return tags
          .filter(tag => descriptions.includes(tag.descrizione))
          .map(tag => tag.id);
      };

      // Conversione formati string a formatoIds array
      const parseformatoIds = (formatiString: string): number[] => {
        if (!formatiString) return [];

        // Se sono descrizioni separate da virgola, trova gli ID corrispondenti
        const descriptions = formatiString.split(',').map(t => t.trim());
        return formati
          .filter(formato => descriptions.includes(formato.descrizione))
          .map(formato => formato.id);
      };

      // Aspetta che autori e editori siano stati caricati prima di settare i dati
      // Settaggio dati iniziali
      setFormData({
        titolo: initialData.titolo || '',
        sottotitolo: initialData.sottotitolo || '',
        autoreId: initialData.autoreId || null,
        editoreId: initialData.editoreId || null,
        annoPubblicazione: initialData.annoPubblicazione || new Date().getFullYear(),
        isbn10: initialData.isbn10 || '',
        isbn13: initialData.isbn13 || '',
        formatoIds: parseformatoIds(initialData.formati || ''),
        prezzo: initialData.prezzo || 0,
        prezzoOriginale: initialData.prezzoOriginale || 0,
        stock: initialData.stock || 0,
        copertinaUrl: initialData.copertinaUrl || '',
        categoriaId: initialData.categoriaId || null,
        tagIds: parseTagIds(initialData.tags || ''),
        descrizione: initialData.descrizione || ''
      });
    }
  }, [mode, initialData, loadingData, tags, formati]);

  const loadAuthorsAndPublishers = async () => {
    setLoadingData(true);
    try {
      const [authorsResponse, publishersResponse, categoriesResponse, tagsResponse, formatiResponse] = await Promise.all([
        fetch('http://localhost:8080/api/authors'),
        fetch('http://localhost:8080/api/publishers'),
        fetch('http://localhost:8080/api/categories'),
        fetch('http://localhost:8080/api/tag'),
        fetch('http://localhost:8080/api/formati')
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

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } else {
        console.error('Errore caricamento categorie');
      }

      if (tagsResponse.ok) {
        const tagsData = await tagsResponse.json();
        setTags(tagsData);
      } else {
        console.error('Errore caricamento tag');
      }

      if (formatiResponse.ok) {
        const formatiData = await formatiResponse.json();
        setFormati(formatiData);
      } else {
        console.error('Errore caricamento formati');
      }
    } catch (error) {
      console.error('Errore durante il caricamento:', error);
      setError('Errore durante il caricamento di autori, editori e categorie');
    } finally {
      setLoadingData(false);
    }
  };

  // Aggiungi un tag
  const handleAddTag = (tagId: number) => {
    if (!formData.tagIds.includes(tagId)) {
      setFormData(prev => ({
        ...prev,
        tagIds: [...prev.tagIds, tagId]
      }));
    }
  };

  // Rimuovi un tag
  const handleRemoveTag = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.filter(id => id !== tagId)
    }));
  };

  // Ottieni tag selezionati
  const getSelectedTags = (): Tag[] => {
    return tags.filter(tag => formData.tagIds.includes(tag.id));
  };

  // Ottieni tag disponibili (non selezionati)
  const getAvailableTags = (): Tag[] => {
    return tags.filter(tag => !formData.tagIds.includes(tag.id));
  };

  // Aggiungi un formato
  const handleAddFormato = (formatoId: number) => {
    if (!formData.formatoIds.includes(formatoId)) {
      setFormData(prev => ({
        ...prev,
        formatoIds: [...prev.formatoIds, formatoId]
      }));
    }
  };

  // Rimuovi un formato
  const handleRemoveformato = (formatoId: number) => {
    setFormData(prev => ({
      ...prev,
      formatoIds: prev.formatoIds.filter(id => id !== formatoId)
    }));
  };

  // Ottieni formato selezionati
  const getSelectedFormati = (): Formato[] => {
    return formati.filter(formato => formData.formatoIds.includes(formato.id));
  };

  // Ottieni formato disponibili (non selezionati)
  const getAvailableFormati = (): Formato[] => {
    return formati.filter(formato => !formData.formatoIds.includes(formato.id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'prezzo' || name === 'prezzoOriginale' || name === 'annoPubblicazione' || name === 'stock'
        ? Number(value)
        : name === 'autoreId' || name === 'editoreId' || name === 'categoriaId'
          ? value === '' ? null : Number(value)
          : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = mode === 'create'
        ? 'http://localhost:8080/api/books'
        : `http://localhost:8080/api/books/${bookId}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();

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
              <label htmlFor="titolo" className="block text-sm font-medium text-gray-700 mb-2">
                Titolo *
              </label>
              <input
                type="text"
                id="titolo"
                name="titolo"
                value={formData.titolo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="sottotitolo" className="block text-sm font-medium text-gray-700 mb-2">
                Sottotitolo
              </label>
              <input
                type="text"
                id="sottotitolo"
                name="sottotitolo"
                value={formData.sottotitolo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Autore e Editore */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Autore e Editore</h3>
            </div>

            <div>
              <label htmlFor="autoreId" className="block text-sm font-medium text-gray-700 mb-2">
                Seleziona Autore *
              </label>
              <select
                id="autoreId"
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

            <div>
              <label htmlFor="editoreId" className="block text-sm font-medium text-gray-700 mb-2">
                Seleziona Editore *
              </label>
              <select
                id="editoreId"
                name="editoreId"
                value={formData.editoreId || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Seleziona un editore --</option>
                {publishers.map((publisher) => (
                  <option key={publisher.id} value={publisher.id}>
                    {publisher.nome}
                    {publisher.sede && publisher.sede !== 'Sede non specificata'
                      ? ` - ${publisher.sede}`
                      : ''}
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
                max={new Date().getFullYear() + 10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="categoriaId" className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                id="categoriaId"
                name="categoriaId"
                value={formData.categoriaId || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Seleziona una categoria --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.descrizione}
                  </option>
                ))}
              </select>
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
              <label htmlFor="isbn13" className="block text-sm font-medium text-gray-700 mb-2">
                ISBN-13 *
              </label>
              <input
                type="text"
                id="isbn13"
                name="isbn13"
                value={formData.isbn13}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="es. 978-8845207051"
              />
            </div>

            {/* Tag Pills/Chips Section */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tag
              </label>

              {/* Tag selezionati (Pills) */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 border border-gray-300 rounded-md bg-gray-50">
                  {getSelectedTags().length > 0 ? (
                    getSelectedTags().map(tag => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
                      >
                        {tag.descrizione}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag.id)}
                          className="text-purple-600 hover:text-purple-900 font-bold ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm italic">
                      Nessun tag selezionato
                    </span>
                  )}
                </div>
              </div>

              {/* Dropdown per aggiungere tag */}
              {getAvailableTags().length > 0 && (
                <div>
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddTag(Number(e.target.value));
                        e.target.value = ''; // Reset selection
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">+ Aggiungi tag...</option>
                    {getAvailableTags().map(tag => (
                      <option key={tag.id} value={tag.id}>
                        {tag.descrizione}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Formati Pills/Chips Section */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Formato
              </label>

              {/* Formato selezionati (Pills) */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 border border-gray-300 rounded-md bg-gray-50">
                  {getSelectedFormati().length > 0 ? (
                    getSelectedFormati().map(formato => (
                      <span
                        key={formato.id}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
                      >
                        {formato.descrizione}
                        <button
                          type="button"
                          onClick={() => handleRemoveformato(formato.id)}
                          className="text-purple-600 hover:text-purple-900 font-bold ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm italic">
                      Nessun formato selezionato
                    </span>
                  )}
                </div>
              </div>

              {/* Dropdown per aggiungere formato */}
              {getAvailableFormati().length > 0 && (
                <div>
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddFormato(Number(e.target.value));
                        e.target.value = ''; // Reset selection
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">+ Aggiungi formato...</option>
                    {getAvailableFormati().map(formato => (
                      <option key={formato.id} value={formato.id}>
                        {formato.descrizione}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Prezzo e Stock */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Prezzo e Disponibilità</h3>
            </div>

            <div>
              <label htmlFor="prezzo" className="block text-sm font-medium text-gray-700 mb-2">
                Prezzo (€) *
              </label>
              <input
                type="number"
                id="prezzo"
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
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                id="stock"
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