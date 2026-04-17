"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { useCart } from '@/context/CartContext';
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CartPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { items, itemCount, total, fetchCart, updateQuantity, removeItem, clearCart, checkout } = useCart();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchCart();
  }, [fetchCart]);

  const handleLogout = () => {
    document.cookie = "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem('user');
    window.location.href = "/login";
  };

  const handleCheckout = async () => {
    const order = await checkout();
    if (order) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 hover:bg-gray-200 rounded-xl transition"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900">Il tuo Carrello</h1>
            <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full font-medium">
              {itemCount} {itemCount === 1 ? 'articolo' : 'articoli'}
            </span>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition font-semibold text-sm"
            >
              <TrashIcon className="w-4 h-4" />
              Svuota carrello
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Stato vuoto */
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <ShoppingBagIcon className="w-20 h-20 mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Il carrello è vuoto</h2>
            <p className="text-gray-500 mb-8">Non hai ancora aggiunto nessun libro al carrello.</p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg"
            >
              Esplora il Catalogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-5 shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={item.book?.copertina_url || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"}
                    alt={item.book?.titolo}
                    className="w-20 h-28 object-cover rounded-xl"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"; }}
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 line-clamp-1">{item.book?.titolo}</h3>
                    <p className="text-sm text-gray-500">
                      di {item.book?.autore?.nome} {item.book?.autore?.cognome}
                    </p>
                    {item.book?.editore && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.book.editore.nome}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.book.id, item.quantita - 1)}
                          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-lg w-8 text-center">{item.quantita}</span>
                        <button
                          onClick={() => updateQuantity(item.book.id, item.quantita + 1)}
                          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xl font-black text-gray-900">
                          €{(item.book?.prezzo * item.quantita).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.book.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Riepilogo */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Riepilogo Ordine</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotale ({itemCount} {itemCount === 1 ? 'articolo' : 'articoli'})</span>
                    <span className="font-semibold">€{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Spedizione</span>
                    <span className="font-semibold text-green-600">Gratuita</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Totale</span>
                    <span className="text-2xl font-black text-gray-900">€{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-200"
                >
                  Conferma Ordine
                </button>

                <Link
                  href="/"
                  className="block text-center mt-3 text-sm text-gray-500 hover:text-blue-600 transition font-medium"
                >
                  Continua gli acquisti
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
