"use client";
import { UserIcon, CheckCircleIcon, XCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

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

interface UsersStatsProps {
  users: User[];
  loading?: boolean;
}

export default function UsersStats({ users, loading = false }: UsersStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.attivo !== false).length;
  const inactiveUsers = users.filter(user => user.attivo === false).length;
  const adminUsers = users.filter(user => user.ruolo === 'ADMIN').length;
  const regularUsers = users.filter(user => user.ruolo === 'USER').length;

  // Calcola gli utenti registrati questo mese (simulato)
  const thisMonthUsers = Math.floor(totalUsers * 0.15); // 15% simulato

  const stats = [
    {
      id: 'total',
      name: 'Totale Utenti',
      value: totalUsers,
      icon: UserIcon,
      color: 'blue',
      change: `${thisMonthUsers} questo mese`,
      changeType: 'positive'
    },
    {
      id: 'active',
      name: 'Utenti Attivi',
      value: activeUsers,
      icon: CheckCircleIcon,
      color: 'green',
      change: `${((activeUsers / Math.max(totalUsers, 1)) * 100).toFixed(1)}% del totale`,
      changeType: 'neutral'
    },
    {
      id: 'inactive',
      name: 'Utenti Inattivi',
      value: inactiveUsers,
      icon: XCircleIcon,
      color: 'red',
      change: inactiveUsers > 0 ? 'Richiede attenzione' : 'Tutti gli utenti attivi',
      changeType: inactiveUsers > 0 ? 'negative' : 'positive'
    },
    {
      id: 'admins',
      name: 'Amministratori',
      value: adminUsers,
      icon: ShieldCheckIcon,
      color: 'purple',
      change: `${regularUsers} utenti normali`,
      changeType: 'neutral'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          text: 'text-blue-600',
          bg: 'bg-blue-100',
          border: 'border-blue-200'
        };
      case 'green':
        return {
          text: 'text-green-600',
          bg: 'bg-green-100',
          border: 'border-green-200'
        };
      case 'red':
        return {
          text: 'text-red-600',
          bg: 'bg-red-100',
          border: 'border-red-200'
        };
      case 'purple':
        return {
          text: 'text-purple-600',
          bg: 'bg-purple-100',
          border: 'border-purple-200'
        };
      default:
        return {
          text: 'text-gray-600',
          bg: 'bg-gray-100',
          border: 'border-gray-200'
        };
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const colors = getColorClasses(stat.color);
        return (
          <div key={stat.id} className={`bg-white rounded-lg shadow-sm border ${colors.border} p-6 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className={`text-3xl font-bold ${colors.text}`}>{stat.value}</p>
                <p className={`text-xs mt-1 ${getChangeColor(stat.changeType)}`}>{stat.change}</p>
              </div>
              <div className={`${colors.bg} p-3 rounded-full`}>
                <stat.icon className={`w-6 h-6 ${colors.text}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}