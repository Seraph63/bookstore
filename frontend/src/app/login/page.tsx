"use client";
import { useState } from 'react';
import AuthScreen from '@/components/auth/AuthScreen';

export default function LoginPage() {
  const [error, setError] = useState("");

  // Gestione Login Utente Registrato
  const handleLogin = async (userData: any) => {
    try {
      // 1. Setta il cookie per il Middleware
      document.cookie = "auth_session=true; path=/; max-age=86400; SameSite=Lax";
      
      // 2. Salva i dati utente per la UI
      localStorage.setItem('user', JSON.stringify(userData));

      // 3. Reindirizza alla Home (Catalogo)
      window.location.href = "/"; 
    } catch (err) {
      console.error(err);
      setError("Errore durante l'accesso");
    }
  };

  // Gestione Accesso Ospite
  const handleGuestLogin = () => {
    document.cookie = "auth_session=true; path=/; max-age=86400; SameSite=Lax";
    localStorage.setItem('user', JSON.stringify({ 
      nome: "Ospite", 
      email: "guest@example.com", 
      isGuest: true 
    }));
    window.location.href = "/";
  };

  return (
    <AuthScreen
      onLoginSuccess={handleLogin}
      onGuestLogin={handleGuestLogin}
    />
  );
}