"use client";
import { useState } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

interface AuthProps {
  onLoginSuccess: (userData: any) => void;
  onGuestLogin: () => void;
}

export default function AuthScreen({ onLoginSuccess, onGuestLogin }: AuthProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [error, setError] = useState("");

  const isBtnDisabled = !email.trim() || !password.trim() || (isRegistering && (!nome.trim() || !cognome.trim()));

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const endpoint = isRegistering ? 'register' : 'login';
    
    // Assicuriamoci che i nomi delle proprietà corrispondano esattamente ai campi nel modello Java User
    const body = isRegistering 
      ? { nome, cognome, email, password } 
      : { email, password };

    try {
      const res = await fetch(`http://localhost:8080/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        onLoginSuccess(data);
      } else {
        // Gestione errore duplicato o errori generici dal backend
        setError(data.message || (isRegistering ? "Errore registrazione: dati duplicati o incompleti" : "Credenziali errate"));
      }
    } catch (err) { 
      setError("Errore di connessione al server"); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          {isRegistering ? "Crea Account" : "Bentornato"}
        </h1>
        
        <form onSubmit={handleAuth} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          {isRegistering && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="sr-only">Nome</label>
                <input 
                  id="nome"
                  type="text" 
                  placeholder="Nome" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="cognome" className="sr-only">Cognome</label>
                <input 
                  id="cognome"
                  type="text" 
                  placeholder="Cognome" 
                  value={cognome} 
                  onChange={(e) => setCognome(e.target.value)} 
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  required 
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input 
              id="email" 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
              required 
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input 
              id="password" 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
              required 
            />
          </div>

          <button 
            disabled={isBtnDisabled} 
            type="submit" 
            className={`w-full py-3 rounded-xl font-bold transition-colors ${
              isBtnDisabled 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
            }`}
          >
            {isRegistering ? "Registrati" : "Accedi"}
          </button>

          <button 
            type="button" 
            onClick={onGuestLogin} 
            className="w-full flex justify-center items-center space-x-2 border border-gray-200 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <UserIcon className="w-5 h-5" />
            <span>Entra come Ospite</span>
          </button>
        </form>

        <button 
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError(""); // Reset errore al cambio modalità
          }} 
          className="w-full mt-6 text-sm text-blue-600 hover:underline font-medium"
        >
          {isRegistering ? "Hai già un account? Accedi" : "Non hai un account? Registrati"}
        </button>
      </div>
    </div>
  );
}