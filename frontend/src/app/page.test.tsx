import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from './page';
import '@testing-library/jest-dom';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: jest.fn() }),
}));

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

const mockBooks = [
  {
    id: 1,
    titolo: 'Il Piccolo Principe',
    autore: { nome: 'Antoine', cognome: 'de Saint-Exupéry' },
    prezzo: 7.65,
    categoria: 'Ragazzi',
    copertinaUrl: 'https://picsum.photos/seed/1/400/600'
  },
  {
    id: 2,
    titolo: 'Moby Dick',
    autore: { nome: 'Herman', cognome: 'Melville' },
    prezzo: 18.70,
    categoria: 'Classico',
    copertinaUrl: 'https://picsum.photos/seed/2/400/600'
  },
];

describe('HomePage', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const mockUser = { id: 1, nome: 'Mario', cognome: 'Rossi', email: 'mario@test.it', isGuest: false };
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'user') return JSON.stringify(mockUser);
      return null;
    });
    Storage.prototype.removeItem = jest.fn();

    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          content: mockBooks,
          totalPages: 1,
          totalElements: mockBooks.length,
          number: 0,
          size: 12,
          first: true,
          last: true,
        }),
      })
    );
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('carica e visualizza i libri dal server', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Il Piccolo Principe')).toBeInTheDocument();
      expect(screen.getByText('Moby Dick')).toBeInTheDocument();
    });
  });

  test('filtra i libri per titolo', async () => {
    render(<HomePage />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Il Piccolo Principe')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/cerca titolo o autore/i);
    await user.type(searchInput, 'moby');

    expect(screen.getByText('Moby Dick')).toBeInTheDocument();
    expect(screen.queryByText('Il Piccolo Principe')).not.toBeInTheDocument();
  });

  test('filtra i libri per nome autore', async () => {
    render(<HomePage />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Il Piccolo Principe')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/cerca titolo o autore/i);
    await user.type(searchInput, 'Antoine');

    expect(screen.getByText('Il Piccolo Principe')).toBeInTheDocument();
    expect(screen.queryByText('Moby Dick')).not.toBeInTheDocument();
  });

  test('mostra il titolo "Catalogo Libri"', async () => {
    render(<HomePage />);

    expect(screen.getByText('Catalogo Libri')).toBeInTheDocument();
  });

  test('utente admin vede icona modifica sulle schede libro', async () => {
    const adminUser = { id: 1, nome: 'Admin', cognome: 'Test', email: 'admin@test.it', isGuest: false, ruolo: 'ADMIN' };
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'user') return JSON.stringify(adminUser);
      return null;
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Il Piccolo Principe')).toBeInTheDocument();
    });

    expect(screen.getAllByLabelText('Modifica libro')).toHaveLength(2);
    expect(screen.getAllByLabelText('Aggiungi al carrello')).toHaveLength(2);
  });

  test('utente non admin non vede icona modifica', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Il Piccolo Principe')).toBeInTheDocument();
    });

    expect(screen.queryByLabelText('Modifica libro')).not.toBeInTheDocument();
    expect(screen.getAllByLabelText('Aggiungi al carrello')).toHaveLength(2);
  });
});
