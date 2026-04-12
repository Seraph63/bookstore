"use client";
import { useState, useEffect } from 'react';
import {
  UserCircleIcon,
  UserIcon,
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

  useEffect(() => {
    if (isLoggedIn) {
      loadBooks();
    }
  }, [isLoggedIn]);
  

  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- LOGICA AUTH ---
  
  // 1. LOGIN
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
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

  // 2. REGISTRAZIONE (Corretto)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cognome, username, password }),
      });

      if (res.ok) {
        // Dopo la registrazione, proviamo il login automatico
        await handleLogin();
      } else {
        const data = await res.json();
        setError(data.error || "Errore durante la registrazione");
      }
    } catch (err) {
      setError("Errore di connessione al server");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    setUsername("");
    setPassword("");
  };

  const handleGuestLogin = () => {
    const guestUser = {
      nome: "Ospite",
      cognome: "",
      username: "guest",
      isGuest: true
    };
    setUser(guestUser);
    setIsLoggedIn(true);
    setError("");
  };

  // --- RENDER ---

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

          {/* FIX: Cambiato handleLogin con handleRegister quando isRegistering è true */}
          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

            {isRegistering && (
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required={isRegistering} />
                <input type="text" placeholder="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required={isRegistering} />
              </div>
            )}

            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required />

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg active:scale-95">
              {isRegistering ? "Registrati" : "Accedi"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Oppure</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full flex items-center justify-center space-x-2 border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-600 font-medium py-3 rounded-xl transition-all"
            >
              <UserIcon className="w-5 h-5" />
              <span>Esplora come ospite</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => { setIsRegistering(!isRegistering); setError(""); }} className="text-blue-600 hover:underline font-medium">
              {isRegistering ? "Hai già un account? Accedi" : "Non hai un account? Registrati ora"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b px-6 py-4 flex justify-between items-center bg-white sticky top-0 z-50 shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600 italic tracking-tight">BookStore</h1>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 p-1 pr-3 hover:bg-gray-100 rounded-full transition text-gray-600 border border-transparent hover:border-gray-200"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
               <UserCircleIcon className="w-8 h-8" />
            </div>
            <span className="font-semibold">{user?.nome}</span>
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded-2xl shadow-2xl z-20 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-3 border-b bg-gray-50">
                  <p className="text-sm font-bold text-gray-900">{user?.nome} {user?.cognome}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.username}</p>
                </div>
                <button 
                  disabled={user?.isGuest}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center ${user?.isGuest ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <span className="mr-3">👤</span> Profilo Utente {user?.isGuest && "(Registrati)"}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center font-bold"
                >
                  <span className="mr-3">🚪</span> Esci
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Il nostro Catalogo</h2>
            <p className="text-gray-500 mt-2">I migliori libri selezionati per te</p>
          </div>

          <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Titolo, autore..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white shadow-sm"
            />
          </div>
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <div key={book.id} className="group bg-white border border-gray-100 rounded-3xl p-4 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-1">
                <div className="aspect-[3/4] mb-5 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden relative shadow-inner">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2787"; }}
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-300">
                      <BookOpenIcon className="w-16 h-16 mb-2" />
                      <span className="text-xs font-medium uppercase tracking-tighter">No Cover</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur text-[10px] font-black text-blue-600 px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest">
                      {book.category}
                    </span>
                  </div>
                </div>

                <div className="flex-grow px-1">
                  <h3 className="font-bold text-gray-900 text-lg leading-snug h-14 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">di <span className="text-gray-600 font-medium">{book.authors}</span></p>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-2xl font-black text-gray-900">€{book.price?.toFixed(2)}</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-90">
                    <PlusIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-xl font-medium">Nessun libro trovato.</p>
          </div>
        )}
      </main>
    </div>
  );
}