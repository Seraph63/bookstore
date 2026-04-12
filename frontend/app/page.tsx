"use client";
import { useState, useEffect } from 'react';
import {
  UserCircleIcon,
  UserIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  PlusIcon
} from '@heroicons/react/24/outline';


export default function HomePage() {
  // --- STATI ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Stati form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [error, setError] = useState("");

  // All'interno di HomePage
  const [books, setBooks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadBooks = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/books');
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (err) {
      console.error("Errore caricamento libri:", err);
    }
  };

  // Carica i libri quando lo stato isLoggedIn cambia a true
  useEffect(() => {
    if (isLoggedIn) {
      loadBooks();
    }
  }, [isLoggedIn]);

  // Filtro per la ricerca
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- LOGICA AUTH ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setIsLoggedIn(true);
      } else {
        setError("Credenziali errate");
      }
    } catch (err) { setError("Errore di connessione"); }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    // Automaticamente, l'app tornerà alla schermata login perché isLoggedIn diventa false
  };

  const handleGuestLogin = () => {
    const guestUser = {
      nome: "Ospite",
      cognome: "",
      username: "guest",
      isGuest: true // Flag utile per disabilitare funzioni come il checkout
    };
    setUser(guestUser);
    setIsLoggedIn(true);
    setError("");
  };

  // --- RENDER CONDIZIONALE ---

  // 1. SCHERMATA DI LOGIN (Se l'utente NON è loggato)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            {isRegistering ? "Crea Account" : "Bentornato"}
          </h1>
          <p className="text-center text-gray-500 mb-8">
            {isRegistering ? "Registrati per iniziare gli acquisti" : "Accedi alla tua libreria personale"}
          </p>

          <form onSubmit={isRegistering ? /* handleRegister */ handleLogin : handleLogin} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {isRegistering && (
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full px-4 py-3 border rounded-xl" required />
                <input type="text" placeholder="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} className="w-full px-4 py-3 border rounded-xl" required />
              </div>
            )}

            <input type="text" placeholder="Email o Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 border rounded-xl" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-xl" required />

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg">
              {isRegistering ? "Registrati" : "Accedi"}
            </button>
            {/* ... dentro il form di login, sotto il tasto submit ... */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Oppure</span>
              </div>
            </div>

            <button
              type="button" // IMPORTANTE: evita di triggerare il submit del form
              onClick={handleGuestLogin}
              className="w-full flex items-center justify-center space-x-2 border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-600 font-medium py-3 rounded-xl transition-all"
            >
              <UserIcon className="w-5 h-5" />
              <span>Esplora come ospite</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => { setIsRegistering(!isRegistering); setError(""); }} className="text-blue-600 hover:underline">
              {isRegistering ? "Hai già un account? Accedi" : "Non hai un account? Registrati ora"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. SCHERMATA E-COMMERCE (Se l'utente È loggato)
  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="border-b px-6 py-4 flex justify-between items-center bg-white sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-600 italic">BookStore</h1>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition text-gray-600"
          >
            <UserCircleIcon className="w-8 h-8" />
            <span className="font-medium">{user?.nome}</span>
          </button>

          {/* DROP-DOWN MENU */}
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-2xl z-20 py-2">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-bold text-gray-800">{user?.nome} {user?.cognome}</p>
                  <p className="text-xs text-gray-500">{user?.username}</p>
                </div>
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                  <span className="mr-2">👤</span> Profilo Utente
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center font-medium"
                >
                  <span className="mr-2">🚪</span> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* CONTENUTO LIBRERIA (Ricerca e Libri) */}
      <main className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header Catalogo */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Catalogo Libri</h2>
            <p className="text-gray-500">Scopri le ultime novità e i grandi classici</p>
          </div>

          {/* Barra di ricerca con Heroicons */}
          <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca per titolo o autore..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {/* Griglia Card */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="group bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                {/* Contenitore Immagine Copertina */}
                <div className="aspect-[3/4] mb-4 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden relative">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={`Copertina di ${book.titolo}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        // Se l'immagine fallisce il caricamento, mostra un fallback
                        e.currentTarget.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2787&auto=format&fit=crop";
                      }}
                    />
                  ) : (
                    // Fallback se il campo coverUrl è proprio null nel DB
                    <div className="flex flex-col items-center text-gray-400">
                      <BookOpenIcon className="w-12 h-12 mb-2" />
                      <span className="text-xs italic">Nessuna copertina</span>
                    </div>
                  )}

                  {/* Badge Categoria sopra l'immagine */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold text-blue-600 px-2 py-1 rounded-md shadow-sm uppercase">
                      {book.categoria}
                    </span>
                  </div>
                </div>

                <div className="flex-grow">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{book.category}</span>
                  <h3 className="font-bold text-gray-900 mt-1 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">di {book.author}</p>
                </div>

                <div className="mt-4 flex items-center justify-between pt-4 border-t">
                  <span className="text-xl font-bold text-gray-900">€{book.price.toFixed(2)}</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors">
                    <PlusIcon className="w-6 h-6" /> {/* Importa PlusIcon da Heroicons */}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlassIcon className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg">Nessun libro trovato per questa ricerca.</p>
          </div>
        )}
      </main>
    </div>
  );
}