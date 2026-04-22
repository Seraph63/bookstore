"use client";
import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import BookCard from '@/components/catalog/BookCard';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const PAGE_SIZE = 12;

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchBooks = useCallback((page: number) => {
    setLoading(true);
    fetch(`http://localhost:8080/api/books?page=${page}&size=${PAGE_SIZE}`)
      .then(res => res.json())
      .then(data => {
        setBooks(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setCurrentPage(data.number);
      })
      .catch(err => console.error("Errore caricamento libri:", err))
      .finally(() => setLoading(false));
  }, []);

  // Handler per l'aggiornamento stock post-checkout
  const handleStockUpdate = useCallback(() => {
    fetchBooks(currentPage);
  }, [fetchBooks, currentPage]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    fetchBooks(0);
  }, [fetchBooks]);

  useEffect(() => {
    // Ascolta l'evento di aggiornamento stock post-checkout  
    window.addEventListener('booksStockUpdated', handleStockUpdate);

    // Cleanup dell'event listener
    return () => {
      window.removeEventListener('booksStockUpdated', handleStockUpdate);
    };
  }, [handleStockUpdate]);

  const handleLogout = () => {
    document.cookie = "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem('user');
    window.location.href = "/login";
  };

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      fetchBooks(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filtro client-side sulla pagina corrente
  const filteredBooks = books.filter(book => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const matchTitolo = book.titolo?.toLowerCase().includes(search);
    const matchAutore = 
      book.autore?.nome?.toLowerCase().includes(search) ||
      book.autore?.cognome?.toLowerCase().includes(search);
    
    return matchTitolo || matchAutore;
  });

  // Genera i numeri di pagina da mostrare
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible);
    start = Math.max(0, end - maxVisible);
    for (let i = start; i < end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout}/>
      <main className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col md:flex-row justify-between mb-10 gap-6">
          <h2 className="text-4xl font-extrabold text-gray-900">Catalogo Libri</h2>
          <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca titolo o autore..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} isAdmin={user?.ruolo === 'ADMIN'} isGuest={!!user?.isGuest} />
              ))}
            </div>

            {/* Paginazione */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                  aria-label="Pagina precedente"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>

                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition ${
                      pageNum === currentPage
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                  aria-label="Pagina successiva"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>

                <span className="ml-4 text-sm text-gray-500">
                  {totalElements} libri totali
                </span>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}