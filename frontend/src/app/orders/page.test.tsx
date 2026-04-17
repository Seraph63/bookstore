import { render, screen, waitFor } from '@testing-library/react';
import OrdersPage from './page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
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
});
