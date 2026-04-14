"use client";
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import BookCard from '@/components/catalog/BookCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Recupera l'utente salvato
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Carica i libri dal backend
    fetch('http://localhost:8080/api/books')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error("Errore caricamento libri:", err));
  }, []);

  const handleLogout = () => {
    // Rimuove cookie e dati locali
    document.cookie = "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem('user');
    window.location.href = "/login";
  };

  const filteredBooks = books.filter(book =>
    book.titolo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.autore?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              className="w-full pl-12 pr-4 py-3 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </main>
    </div>
  );
}
