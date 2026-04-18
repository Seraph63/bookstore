"use client";
import { ShoppingCartIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface BookCardProps {
  book: any;
  isAdmin?: boolean;
  isGuest?: boolean;
}

export default function BookCard({ book, isAdmin = false, isGuest = false }: BookCardProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const outOfStock = !book.stock || book.stock <= 0;
  
  // Genera un'immagine di fallback diversa per ogni libro
  const generateFallbackImage = (book: any) => {
    const bookId = book.id || 1;
    const categoria = book.categoria || 'libro';
    const seed = bookId + (book.titolo?.length || 0);
    return `https://picsum.photos/seed/${seed}/400/600`;
  };

  const handleEditBook = () => {
    router.push(`/admin/books/${book.id}/edit`);
  };

  return (
    <div className="group bg-white border border-gray-100 rounded-3xl p-4 shadow-sm hover:shadow-2xl transition-all flex flex-col">
      <div className="aspect-[3/4] mb-5 bg-gray-100 rounded-2xl overflow-hidden relative">
        <img
          src={book.copertina_url || generateFallbackImage(book)}
          alt={book.titolo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => { e.currentTarget.src = generateFallbackImage(book); }}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur text-[10px] font-black text-blue-600 px-3 py-1.5 rounded-full uppercase">
            {book.categoria}
          </span>
        </div>
      </div>
      <div className="flex-grow">
        <h3 className="font-bold text-gray-900 text-lg line-clamp-2">{book.titolo}</h3>
        <p className="text-sm text-gray-400">
          di <span className="text-gray-600">
            {book.nomeAutore ? `${book.nomeAutore} ${book.cognomeAutore || ''}`.trim() : 'Autore Sconosciuto'}
          </span>
        </p>
        <p className="text-xs mt-1">
          {book.stock > 0
            ? <span className="text-green-600">Disponibili: {book.stock}</span>
            : <span className="text-red-500">Non disponibile</span>}
        </p>
      </div>
      <div className="mt-6 flex items-center justify-between pt-4 border-t">
        <span className="text-2xl font-black text-gray-900">€{book.prezzo?.toFixed(2)}</span>
        <div className="flex gap-2">
          {isAdmin && (
            <button 
              aria-label="Modifica libro" 
              onClick={handleEditBook}
              className="bg-amber-500 text-white p-3 rounded-2xl shadow-lg active:scale-90 hover:bg-amber-600 transition"
            >
              <PencilSquareIcon className="w-6 h-6" />
            </button>
          )}
          {!isGuest && (
            <button
              aria-label="Aggiungi al carrello"
              onClick={() => addItem(book.id, 1)}
              disabled={outOfStock}
              className={`p-3 rounded-2xl shadow-lg active:scale-90 transition ${
                outOfStock
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <ShoppingCartIcon className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}