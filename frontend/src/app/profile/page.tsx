"use client";
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  UserCircleIcon,
  EnvelopeIcon,
  IdentificationIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasShownToast = useRef(false);

  useEffect(() => {
    // 1. CARICAMENTO UTENTE
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      router.push('/');
      return;
    }

    // 2. LOGICA TOAST CORRETTA
    if (searchParams.get('updated') === 'true' && !hasShownToast.current) {
      // Segniamo che il messaggio è stato mostrato per questo caricamento
      hasShownToast.current = true;

      toast.success("Profilo aggiornato con successo! ✨");

      // Pulizia URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [router, searchParams]);

  const handleBackToCatalog = () => {
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        onLogout={() => {
          localStorage.removeItem('user');
          router.push('/');
        }}
      />

      <main className="max-w-3xl mx-auto p-8 animate-in fade-in zoom-in duration-300">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 h-32 relative">
            <button
              onClick={handleBackToCatalog}
              className="absolute top-4 left-4 flex items-center space-x-2 bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-xl transition backdrop-blur-md"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="text-sm font-bold">Torna al Catalogo</span>
            </button>
          </div>

          <div className="px-8 pb-8">
            <div className="relative -top-12 flex items-end space-x-6">
              <div className="bg-white p-2 rounded-3xl shadow-lg">
                <div className="bg-blue-100 w-32 h-32 rounded-2xl flex items-center justify-center text-blue-600">
                  <UserCircleIcon className="w-20 h-20" />
                </div>
              </div>
              <div className="mb-14">
                <h2 className="text-3xl font-bold text-gray-900">{user.nome} {user.cognome}</h2>
                <p className="text-gray-500">Profilo Personale</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 -mt-6">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center space-x-3 mb-1">
                  <EnvelopeIcon className="w-5 h-5 text-blue-500" />
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Email</p>
                </div>
                <p className="text-gray-900 font-medium ml-8">{user.email}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center space-x-3 mb-1">
                  <IdentificationIcon className="w-5 h-5 text-blue-500" />
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Stato Account</p>
                </div>
                <p className="text-gray-900 font-medium ml-8">
                  {user.isGuest ? 'Ospite' : 'Utente Registrato'}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t flex justify-end items-center space-x-4">
              <button
                onClick={handleBackToCatalog}
                className="text-gray-500 hover:text-red-500 font-bold px-6 py-3 transition-colors rounded-xl hover:bg-red-50"
              >
                Annulla
              </button>

              <Link href="/profile/edit">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">
                  Modifica Profilo
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}