"use client";
import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { toast } from 'sonner';

const API_BASE = 'http://localhost:8080/api/cart';

interface CartItemData {
  id: number;
  book: any;
  quantita: number;
}

interface CartContextType {
  items: CartItemData[];
  loading: boolean;
  itemCount: number;
  total: number;
  fetchCart: () => Promise<void>;
  addItem: (bookId: number, quantita?: number) => Promise<void>;
  updateQuantity: (bookId: number, quantita: number) => Promise<void>;
  removeItem: (bookId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<any>;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve essere usato dentro un CartProvider');
  }
  return context;
}

function getUserId(): number | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem('user');
  if (!saved) return null;
  const user = JSON.parse(saved);
  if (user.isGuest) return null;
  return user.id ?? null;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${userId}`);
      if (!res.ok) {
        console.error("Errore caricamento carrello:", res.status, res.statusText);
        return;
      }
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error("Errore caricamento carrello:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (bookId: number, quantita = 1) => {
    const userId = getUserId();
    if (!userId) {
      toast.error("Devi essere registrato per aggiungere al carrello");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/${userId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, quantita }),
      });

      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        toast.success("Aggiunto al carrello!");
      } else {
        const err = await res.json();
        toast.error(err.message || "Errore aggiunta al carrello");
      }
    } catch {
      toast.error("Errore di connessione");
    }
  }, []);

  const updateQuantity = useCallback(async (bookId: number, quantita: number) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const res = await fetch(`${API_BASE}/${userId}/items/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantita }),
      });

      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      } else {
        const err = await res.json();
        toast.error(err.message || "Errore aggiornamento quantità");
      }
    } catch {
      toast.error("Errore di connessione");
    }
  }, []);

  const removeItem = useCallback(async (bookId: number) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const res = await fetch(`${API_BASE}/${userId}/items/${bookId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        toast.success("Rimosso dal carrello");
      } else {
        toast.error("Errore rimozione dal carrello");
      }
    } catch {
      toast.error("Errore di connessione");
    }
  }, []);

  const clearCart = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const res = await fetch(`${API_BASE}/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setItems([]);
        toast.success("Carrello svuotato");
      }
    } catch {
      toast.error("Errore di connessione");
    }
  }, []);

  const checkout = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return null;

    try {
      const res = await fetch(`${API_BASE}/${userId}/checkout`, {
        method: 'POST',
      });

      if (res.ok) {
        const order = await res.json();
        setItems([]);
        toast.success(`Ordine #${order.id} completato con successo!`);
        return order;
      } else {
        const err = await res.json();
        toast.error(err.message || "Errore durante il checkout");
        return null;
      }
    } catch {
      toast.error("Errore di connessione");
      return null;
    }
  }, []);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantita, 0), [items]);
  const total = useMemo(() => items.reduce((sum, item) => sum + (item.book?.prezzo || 0) * item.quantita, 0), [items]);

  const value = useMemo(() => ({
    items, loading, itemCount, total,
    fetchCart, addItem, updateQuantity, removeItem, clearCart, checkout,
  }), [items, loading, itemCount, total, fetchCart, addItem, updateQuantity, removeItem, clearCart, checkout]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
