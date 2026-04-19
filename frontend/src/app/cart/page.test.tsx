import { render, screen } from '@testing-library/react';
import CartPage from './page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock del CartContext
const mockUseCart = {
  items: [],
  itemCount: 0,
  total: 0,
  loading: false,
  fetchCart: jest.fn(),
  addItem: jest.fn(),
  updateQuantity: jest.fn(),
  removeItem: jest.fn(),
  clearCart: jest.fn(),
  checkout: jest.fn().mockResolvedValue(null),
};

jest.mock('@/context/CartContext', () => ({
  useCart: () => mockUseCart,
  CartProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('CartPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Simula utente nel localStorage
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'user') return JSON.stringify({ id: 1, nome: 'Mario', cognome: 'Rossi', email: 'mario@test.it' });
      return null;
    });
  });

  it('mostra stato vuoto quando il carrello è vuoto', () => {
    render(<CartPage />);
    expect(screen.getByRole('heading', { name: 'Il carrello è vuoto' })).toBeInTheDocument();
    expect(screen.getByText('Esplora il Catalogo')).toBeInTheDocument();
  });

  it('mostra gli items quando il carrello ha contenuto', () => {
    mockUseCart.items = [
      {
        id: 1,
        book: {
          id: 1,
          titolo: 'Il Nome della Rosa',
          prezzo: 15.0,
          autore: { nome: 'Umberto', cognome: 'Eco' },
          editore: { nome: 'Bompiani' },
        },
        quantita: 2,
      },
    ];
    mockUseCart.itemCount = 2;
    mockUseCart.total = 30;

    render(<CartPage />);
    expect(screen.getAllByText('Il Nome della Rosa').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('€30.00').length).toBeGreaterThanOrEqual(1);
  });

  it('chiama fetchCart al mount', () => {
    render(<CartPage />);
    expect(mockUseCart.fetchCart).toHaveBeenCalled();
  });

  afterEach(() => {
    mockUseCart.items = [];
    mockUseCart.itemCount = 0;
    mockUseCart.total = 0;
  });
});
