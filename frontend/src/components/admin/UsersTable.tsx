"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PencilSquareIcon, TrashIcon, EyeIcon, UserIcon } from '@heroicons/react/24/outline';
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

interface UsersTableProps {
  users: User[];
  loading?: boolean;
  onDelete?: (userId: number) => Promise<void>;
  onToggleActive?: (userId: number, isActive: boolean) => Promise<void>;
  onRefresh?: () => void;
}

export default function UsersTable({ users, loading = false, onDelete, onToggleActive, onRefresh }: UsersTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const handleDelete = async (userId: number) => {
    if (!onDelete) return;
    
    if (!confirm('Sei sicuro di voler eliminare questo utente? Questa azione non può essere annullata.')) {
      return;
    }

    try {
      setDeletingId(userId);
      await onDelete(userId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Errore eliminazione utente');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (user: User) => {
    if (!onToggleActive) return;

    const action = user.attivo ? 'disattivare' : 'attivare';
    if (!confirm(`Sei sicuro di voler ${action} questo utente?`)) {
      return;
    }

    try {
      setTogglingId(user.id);
      await onToggleActive(user.id, user.attivo || false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Errore modifica stato utente');
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const getRoleBadge = (ruolo: string) => {
    switch (ruolo) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'USER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (attivo?: boolean) => {
    if (attivo === false) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-green-100 text-green-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="animate-pulse">
          <div className="bg-gray-50 px-6 py-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-gray-200 px-6 py-4">
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ruolo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registrazione
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-4">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.nome} {user.cognome}
                      </div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(user.ruolo)}`}>
                    {user.ruolo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.attivo)}`}>
                    {user.attivo === false ? 'Inattivo' : 'Attivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(user.dataRegistrazione)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => router.push(`/admin/users/${user.id}`)}
                      className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Visualizza dettagli"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                      className="text-amber-600 hover:text-amber-900 p-2 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Modifica"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    {onToggleActive && (
                      <button
                        onClick={() => handleToggleActive(user)}
                        disabled={togglingId === user.id}
                        className={`p-2 rounded-lg transition-colors ${
                          user.attivo 
                            ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50' 
                            : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                        } disabled:opacity-50`}
                        title={user.attivo ? 'Disattiva utente' : 'Attiva utente'}
                      >
                        {togglingId === user.id ? (
                          <div className="w-4 h-4 animate-spin border-2 border-current border-t-transparent rounded-full"></div>
                        ) : (
                          <span className="text-xs font-medium">
                            {user.attivo ? 'OFF' : 'ON'}
                          </span>
                        )}
                      </button>
                    )}
                    {onDelete && user.ruolo !== 'ADMIN' && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deletingId === user.id}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Elimina"
                      >
                        {deletingId === user.id ? (
                          <div className="w-4 h-4 animate-spin border-2 border-red-600 border-t-transparent rounded-full"></div>
                        ) : (
                          <TrashIcon className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <UserIcon className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500 text-lg mb-4">Nessun utente trovato</p>
          <button
            onClick={() => router.push('/admin/users/create')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Aggiungi il primo utente
          </button>
        </div>
      )}
    </div>
  );
}