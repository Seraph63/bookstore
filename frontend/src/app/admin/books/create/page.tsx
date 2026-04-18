"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BookForm from '@/components/admin/BookForm';
import Navbar from '@/components/layout/Navbar';

export default function CreateBookPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Carica l'utente dal localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      // Verifica se l'utente è admin
      if (userData.ruolo !== 'ADMIN') {
        router.push('/');
        return;
      }
    } else {
      router.push('/login');
      return;
    }
  }, [router]);

  const handleLogout = () => {
    document.cookie = "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="min-h-screen bg-gray-50 py-8">
        <BookForm mode="create" />
      </div>
    </>
  );
}