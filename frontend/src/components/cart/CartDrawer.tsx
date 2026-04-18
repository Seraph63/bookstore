"use client";
import { useCart } from '@/context/CartContext';
import { XMarkIcon, TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, itemCount, total, updateQuantity, removeItem, clearCart, checkout } = useCart();

  const handleCheckout = async () => {
    const order = await checkout();
    if (order) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Carrello <span className="text-sm font-normal text-gray-500">({itemCount} {itemCount === 1 ? 'articolo' : 'articoli'})</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingBagIcon className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">Il carrello è vuoto</p>
              <p className="text-sm">Inizia ad aggiungere qualche libro!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-gray-50 rounded-2xl p-3">
                <img
                  src={item.book?.copertinaUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"}
                  alt={item.book?.titolo}
                  className="w-16 h-20 object-cover rounded-xl"
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"; }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">{item.book?.titolo}</h3>
                  <p className="text-xs text-gray-500">
                    {item.book?.autore?.nome} {item.book?.autore?.cognome}
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1">€{item.book?.prezzo?.toFixed(2)}</p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.book.id, item.quantita - 1)}
                        className="w-7 h-7 rounded-lg bg-white border flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        <MinusIcon className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantita}</span>
                      <button
                        onClick={() => updateQuantity(item.book.id, item.quantita + 1)}
                        className="w-7 h-7 rounded-lg bg-white border flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        <PlusIcon className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.book.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Totale</span>
              <span className="text-2xl font-black text-gray-900">€{total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-200"
            >
              Procedi al Checkout
            </button>

            <div className="flex gap-3">
              <Link
                href="/cart"
                onClick={onClose}
                className="flex-1 text-center border border-gray-200 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Vedi Carrello
              </Link>
              <button
                onClick={clearCart}
                className="flex-1 text-center border border-red-200 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition"
              >
                Svuota
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
