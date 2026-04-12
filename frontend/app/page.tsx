"use client";
import { useState, useEffect } from 'react';
import {
  UserCircleIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const [books, setBooks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);


  // Stati per il form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [user, setUser] = useState<any>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, nome, cognome }),
      });

      if (res.ok) {
        // Dopo la registrazione, logghiamo l'utente automaticamente
        handleLogin(e);
        setIsRegistering(false);
      } else {
        setError("Errore durante la registrazione");
      }
    } catch (err) {
      setError("Errore di rete");
    }
  };

  // Funzione per caricare i libri (standard o ricerca)
  const loadBooks = async (query = "") => {
    try {
      // Usiamo localhost per le chiamate dal browser dell'utente al backend Docker
      const url = query
        ? `http://localhost:8080/api/books/search?q=${encodeURIComponent(query)}`
        : 'http://localhost:8080/api/books';

      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (error) {
      console.error("Errore nel caricamento dei libri:", error);
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }), // Usa gli stati del form
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setIsLoggedIn(true);
        setShowAuthModal(false);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || "Credenziali non valide");
      }
    } catch (err) {
      console.error("Dettaglio errore:", err); // GUARDA QUESTO NELLA CONSOLE F12
      setError("Errore di connessione al server");
    }
  };
  // Caricamento iniziale dei libri al montaggio del componente
  useEffect(() => {
    loadBooks();
  }, []);

  // Gestione dell'input di ricerca con aggiornamento in tempo reale
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    loadBooks(value);
  };

  const handleUserClick = () => {
    if (isLoggedIn) {
      alert("Accesso al profilo utente...");
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-600 tracking-tight shrink-0">Bookstore</h1>

        {/* BARRA DI RICERCA */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative group">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Cerca per titolo o autore..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          {/* CARRELLO */}
          <div className="relative cursor-pointer hover:opacity-70 transition-opacity">
            <ShoppingCartIcon className="h-7 w-7 text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
              0
            </span>
          </div>

          {/* ICONA UTENTE */}
          <div className="relative cursor-pointer hover:opacity-70 transition-opacity" onClick={handleUserClick}>
            <UserCircleIcon className={`h-8 w-8 ${isLoggedIn ? 'text-blue-600' : 'text-gray-600'}`} />
            {isLoggedIn && (
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
            )}
              {isLoggedIn && user ? `${user.nome} ${user.cognome} (${user.ruolo})` : "Ospite"}
          </div>
        </div>
      </nav>

      {/* SEZIONE LIBRI */}
      <main className="p-8 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {searchQuery ? `Risultati per "${searchQuery}"` : "Catalogo Libri"}
            </h2>
            <p className="text-gray-500 mt-1">Esplora la nostra selezione di titoli</p>
          </div>
          <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
            {books.length} libri disponibili
          </span>
        </header>

        {books.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-gray-500 text-lg">Nessun libro trovato con i criteri inseriti.</p>
            <button
              onClick={() => { setSearchQuery(""); loadBooks(""); }}
              className="mt-4 text-blue-600 font-bold hover:text-blue-800 transition-colors"
            >
              Ripristina catalogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {books.map((book: any) => (
              <div key={book.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col border border-gray-100">
                <div className="relative h-72 w-full overflow-hidden bg-gray-200">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2 leading-snug h-14">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 italic truncate">
                    di {book.authors}
                  </p>

                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-2xl font-black text-blue-600">
                      €{book.price.toFixed(2)}
                    </span>
                    <button className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100">
                      <ShoppingCartIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODALE AUTENTICAZIONE */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-gray-900">
                {isRegistering ? 'Crea Account' : 'Bentornato'}
              </h2>
              <p className="text-gray-500 mt-2">Accedi alla tua libreria personale</p>
            </div>

            <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}

              {isRegistering && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text" placeholder="Nome" value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="px-4 py-2 border rounded-xl" required
                  />
                  <input
                    type="text" placeholder="Cognome" value={cognome}
                    onChange={(e) => setCognome(e.target.value)}
                    className="px-4 py-2 border rounded-xl" required
                  />
                </div>
              )}

              <input
                type="text" placeholder="Username" value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl" required
              />

              <input
                type="password" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl" required
              />

              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
                {isRegistering ? 'Crea Account' : 'Accedi'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-600">
                {isRegistering ? 'Hai già un account?' : 'Non hai ancora un account?'}
                <button
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="ml-2 text-blue-600 font-black hover:underline underline-offset-4"
                >
                  {isRegistering ? 'Accedi qui' : 'Registrati ora'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}