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
  const [isLoading, setIsLoading] = useState(false); // Inizializza SEMPRE con false, non null

  const isInvalid = isRegistering 
    ? !nome || !cognome || !email || !password 
    : !email || !password;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const endpoint = isRegistering ? 'register' : 'login';
    const body = isRegistering ? { nome, cognome, email, password } : { email, password };

    try {
      const res = await fetch(`http://localhost:8080/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        onLoginSuccess(data);
      } else {
        setError(isRegistering ? "Errore registrazione" : "Credenziali errate");
      }
    } catch (err) { setError("Errore di connessione"); }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">{isRegistering ? "Crea Account" : "Bentornato"}</h1>
        <form onSubmit={handleAuth} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {isRegistering && (
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} className="p-3 border rounded-xl" required />
              <input type="text" placeholder="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} className="p-3 border rounded-xl" required />
            </div>
          )}
          <label htmlFor="email" className="sr-only">Email</label>
          <input id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-xl" required />
          <label htmlFor="password" className="sr-only">Password</label>
          <input id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-xl" required />
          <button disabled={isLoading || false} type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">{isRegistering ? "Registrati" : "Accedi"}

          </button>
          <button type="button" onClick={onGuestLogin} className="w-full flex justify-center space-x-2 border py-3 rounded-xl text-gray-600"><UserIcon className="w-5 h-5"/><span>Ospite</span></button>
        </form>
        <button onClick={() => setIsRegistering(!isRegistering)} className="w-full mt-4 text-blue-600">
          {isRegistering ? "Vai al Login" : "Crea un account"}
        </button>
      </div>
    </div>
  );
}