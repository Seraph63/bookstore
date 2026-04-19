import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import OrdersPage from './page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock del CartContext
jest.mock('@/context/CartContext', () => ({
  useCart: () => ({
    items: [],
    itemCount: 0,
    total: 0,
    loading: false,
    fetchCart: jest.fn(),
    addItem: jest.fn(),
    updateQuantity: jest.fn(),
    removeItem: jest.fn(),
    clearCart: jest.fn(),
    checkout: jest.fn(),
  }),
  CartProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('OrdersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'user') return JSON.stringify({ id: 1, nome: 'Mario', cognome: 'Rossi', email: 'mario@test.it' });
      return null;
    });
  });

  it('mostra stato vuoto quando non ci sono ordini', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }) as jest.Mock;

    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText('Nessun ordine')).toBeInTheDocument();
    });
  });

  it('mostra gli ordini quando presenti', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          totale: 25.50,
          stato: 'COMPLETATO',
          createdAt: '2026-04-15T10:30:00',
          items: [
            {
              id: 1,
              book: { id: 1, titolo: 'Il Grande Gatsby' },
              quantita: 2,
              prezzoUnitario: 12.75,
            },
          ],
        },
      ],
    }) as jest.Mock;

    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('COMPLETATO')).toBeInTheDocument();
      expect(screen.getAllByText(/25\.50/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Il Grande Gatsby')).toBeInTheDocument();
    });
  });

  it('mostra il conteggio ordini nell header', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          totale: 10.00,
          stato: 'COMPLETATO',
          createdAt: '2026-04-15T10:30:00',
          items: [],
        },
      ],
    }) as jest.Mock;

    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText('1 ordine')).toBeInTheDocument();
    });
  });

  it('mostra bottoni +/- per modificare la quantità', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          totale: 25.50,
          stato: 'COMPLETATO',
          createdAt: '2026-04-15T10:30:00',
          items: [
            {
              id: 1,
              book: { id: 1, titolo: 'Il Grande Gatsby' },
              quantita: 2,
              prezzoUnitario: 12.75,
            },
          ],
        },
      ],
    }) as jest.Mock;

    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText('Il Grande Gatsby')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Aumenta quantità')).toBeInTheDocument();
    expect(screen.getByLabelText('Diminuisci quantità')).toBeInTheDocument();
  });

  it('il bottone - è disabilitato quando la quantità è 1', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          totale: 12.75,
          stato: 'COMPLETATO',
          createdAt: '2026-04-15T10:30:00',
          items: [
            {
              id: 1,
              book: { id: 1, titolo: 'Test Book' },
              quantita: 1,
              prezzoUnitario: 12.75,
            },
          ],
        },
      ],
    }) as jest.Mock;

    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Diminuisci quantità')).toBeDisabled();
    expect(screen.getByLabelText('Aumenta quantità')).not.toBeDisabled();
  });

  it('chiama il backend per aggiornare la quantità al click su +', async () => {
    const updatedOrder = {
      id: 1,
      totale: 38.25,
      stato: 'COMPLETATO',
      createdAt: '2026-04-15T10:30:00',
      items: [
        { id: 1, book: { id: 1, titolo: 'Il Grande Gatsby' }, quantita: 3, prezzoUnitario: 12.75 },
      ],
    };

    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [
        {
          id: 1, totale: 25.50, stato: 'COMPLETATO', createdAt: '2026-04-15T10:30:00',
          items: [{ id: 1, book: { id: 1, titolo: 'Il Grande Gatsby' }, quantita: 2, prezzoUnitario: 12.75 }],
        },
      ]})
      .mockResolvedValueOnce({ ok: true, json: async () => updatedOrder }) as jest.Mock;

    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText('Il Grande Gatsby')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Aumenta quantità'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/orders/items/1',
        expect.objectContaining({ method: 'PUT' })
      );
    });
  });

  it('mostra il bottone cestino per rimuovere un articolo', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          totale: 12.75,
          stato: 'COMPLETATO',
          createdAt: '2026-04-15T10:30:00',
          items: [
            { id: 1, book: { id: 1, titolo: 'Test Book' }, quantita: 1, prezzoUnitario: 12.75 },
          ],
        },
      ],
    }) as jest.Mock;

    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Rimuovi articolo')).toBeInTheDocument();
  });

  it('chiama DELETE al click sul cestino', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [
        {
          id: 1, totale: 25.50, stato: 'COMPLETATO', createdAt: '2026-04-15T10:30:00',
          items: [
            { id: 1, book: { id: 1, titolo: 'Il Grande Gatsby' }, quantita: 2, prezzoUnitario: 12.75 },
          ],
        },
      ]})
      .mockResolvedValueOnce({ ok: true, json: async () => ({ deleted: true, orderId: 1 }) }) as jest.Mock;

    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText('Il Grande Gatsby')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Rimuovi articolo'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/orders/items/1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });
});
