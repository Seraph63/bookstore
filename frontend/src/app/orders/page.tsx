"use client";
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { ArrowLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface OrderItem {
  id: number;
  book: {
    id: number;
    titolo: string;
    autpimagine?: string;
  };
  quantita: number;
  prezzoUnitario: number;
}

interface Order {
  id: number;
  totale: number;
  stato: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      fetchOrders(parsed.id);
    }
  }, []);

  const fetchOrders = async (userId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/orders/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem('user');
    window.location.href = "/login";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 hover:bg-gray-200 rounded-xl transition">
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">I tuoi Ordini</h1>
          <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full font-medium">
            {orders.length} {orders.length === 1 ? 'ordine' : 'ordini'}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <ShoppingBagIcon className="w-20 h-20 mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nessun ordine</h2>
            <p className="text-gray-500 mb-8">Non hai ancora effettuato nessun ordine.</p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg"
            >
              Esplora il Catalogo
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Order header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Ordine</p>
                      <p className="font-bold text-gray-900">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Data</p>
                      <p className="text-sm text-gray-700">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Articoli</p>
                      <p className="text-sm text-gray-700">
                        {order.items.reduce((sum, item) => sum + item.quantita, 0)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-1">
                      {order.stato}
                    </span>
                    <p className="text-lg font-extrabold text-gray-900">€{order.totale.toFixed(2)}</p>
                  </div>
                </div>

                {/* Order items */}
                <div className="divide-y">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-6 py-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.book.titolo}</p>
                        <p className="text-sm text-gray-500">
                          Quantità: {item.quantita} × €{item.prezzoUnitario.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900">
                        €{(item.quantita * item.prezzoUnitario).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
