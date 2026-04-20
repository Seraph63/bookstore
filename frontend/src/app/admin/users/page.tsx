"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import UsersStats from '@/components/admin/UsersStats';
import UsersTable from '@/components/admin/UsersTable';

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

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:8080/api/users');
      if (!response.ok) {
        throw new Error('Errore caricamento utenti');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number): Promise<void> => {
    const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Errore eliminazione utente');
    }

    // Rimuovi l'utente dalla lista locale
    setUsers(prev => prev.filter(user => user.id !== userId));
    
    // Mostra messaggio di successo
    toast.success('Utente eliminato con successo!');
  };

  const handleToggleActive = async (userId: number, isActive: boolean): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}/toggle-active`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attivo: !isActive }),
      });

      if (!response.ok) {
        throw new Error('Errore aggiornamento stato utente');
      }

      // Aggiorna l'utente nella lista locale
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, attivo: !isActive } : user
      ));
      
      toast.success(`Utente ${isActive ? 'disattivato' : 'attivato'} con successo!`);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Errore sconosciuto');
    }
  };

  if (error) {
    return (
      <div className="py-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestione Utenti</h1>
            <p className="text-gray-600 mt-2">Gestisci tutti gli utenti registrati</p>
          </div>
          <button
            onClick={() => router.push('/admin/users/create')}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
          >
            <PlusIcon className="w-5 h-5" />
            Nuovo Utente
          </button>
        </div>

        {/* Stats */}
        <UsersStats users={users} loading={loading} />

        {/* Table */}
        <UsersTable 
          users={users} 
          loading={loading} 
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          onRefresh={fetchUsers}
        />
      </div>
    </div>
  );
}