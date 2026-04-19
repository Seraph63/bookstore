"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/admin/AdminNavbar';

interface User {
  nome: string;
  cognome: string;
  ruolo: string;
  isGuest?: boolean;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carica l'utente dal localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      
      // Verifica se l'utente è admin
      if (userData.ruolo !== 'ADMIN') {
        router.push('/');
        return;
      }
      
      setUser(userData);
    } else {
      router.push('/login');
      return;
    }
    
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    document.cookie = "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento pannello admin...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Il redirect è già gestito nell'useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar user={user} onLogout={handleLogout} />
      <main>
        {children}
      </main>
    </div>
  );
}