"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PencilSquareIcon, TrashIcon, ArrowLeftIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface User {
  id: number;
  username: string;
  nome: string;
  cognome: string;
  email: string;
  ruolo: string;
  dataRegistrazione?: string;
  attivo?: boolean;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // L'autenticazione admin è gestita dal layout admin
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`http://localhost:8080/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Utente non trovato');
      }
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore caricamento utente');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !confirm('Sei sicuro di voler eliminare questo utente? Questa azione non può essere annullata.')) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Errore eliminazione utente');
      }

      toast.success('Utente eliminato con successo!');
      
      setTimeout(() => {
        router.push('/admin/users');
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore eliminazione utente';
      toast.error(`Errore: ${errorMessage}`);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non disponibile';
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (ruolo: string) => {
    switch (ruolo) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'USER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (attivo?: boolean) => {
    if (attivo === false) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-green-100 text-green-800';
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error || 'Utente non trovato'}</p>
            <button 
              onClick={() => router.push('/admin/users')} 
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Torna alla lista utenti
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/admin/users')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Torna alla gestione utenti
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/admin/users/${userId}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <PencilSquareIcon className="w-5 h-5" />
              Modifica
            </button>
            {user.ruolo !== 'ADMIN' && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
                {deleting ? 'Eliminazione...' : 'Elimina'}
              </button>
            )}
          </div>
        </div>

        {/* User Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header con avatar e info principali */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-6 text-white">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                {user.ruolo === 'ADMIN' ? (
                  <ShieldCheckIcon className="w-10 h-10" />
                ) : (
                  <UserIcon className="w-10 h-10" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.nome} {user.cognome}</h1>
                <p className="text-purple-100 text-lg">@{user.username}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-cyan bg-opacity-20 text-white`}>
                    {user.ruolo === 'ADMIN' ? 'Amministratore' : 'Utente'}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    user.attivo === false ? 'bg-red-500 bg-opacity-20' : 'bg-green-500 bg-opacity-20'
                  }`}>
                    {user.attivo === false ? 'Inattivo' : 'Attivo'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dettagli */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informazioni Personali</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nome completo</dt>
                    <dd className="text-lg text-gray-900">{user.nome} {user.cognome}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-lg text-gray-900">{user.email || 'Non specificata'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Username</dt>
                    <dd className="text-lg text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                      {user.username}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informazioni Account</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ruolo</dt>
                    <dd>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRoleColor(user.ruolo)}`}>
                        {user.ruolo === 'ADMIN' ? 'Amministratore' : 'Utente'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Stato</dt>
                    <dd>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(user.attivo)}`}>
                        {user.attivo === false ? 'Inattivo' : 'Attivo'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Data registrazione</dt>
                    <dd className="text-lg text-gray-900">{formatDate(user.dataRegistrazione)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID Utente</dt>
                    <dd className="text-lg text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                      #{user.id}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}