import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navbar from './Navbar';
import '@testing-library/jest-dom';

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

describe('Navbar', () => {
  const mockLogout = jest.fn();
  const registeredUser = { id: 1, nome: 'Mario', cognome: 'Rossi', email: 'mario@test.it', isGuest: false };
  const guestUser = { id: 999, nome: 'Ospite', cognome: 'User', email: 'guest@test.it', isGuest: true };
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = (...args: unknown[]) => {
      if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) return;
      originalConsoleError(...args);
    };
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'user') return JSON.stringify({ id: 1, nome: 'Mario', cognome: 'Rossi' });
      return null;
    });
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  test('il tasto "Profilo" deve essere disabilitato se l\'utente è un Ospite', async () => {
    render(<Navbar user={guestUser} onLogout={mockLogout} />);

    fireEvent.click(screen.getByRole('button', { name: /ospite/i }));

    const profileLink = await screen.findByText(/profilo utente/i);
    const container = profileLink.closest('a') || profileLink.closest('button');

    expect(container).toHaveClass('pointer-events-none');
    expect(container).toHaveClass('text-gray-400');
  });

  test('il tasto "Profilo" deve essere abilitato per un utente registrato', async () => {
    render(<Navbar user={registeredUser} onLogout={mockLogout} />);

    fireEvent.click(screen.getByRole('button', { name: /mario/i }));

    const profileLink = await screen.findByText(/profilo utente/i);
    const container = profileLink.closest('a') || profileLink.closest('button');

    expect(container).toBeInTheDocument();
    expect(container).not.toHaveClass('pointer-events-none');
  });

  test('mostra il nome utente nella barra di navigazione', async () => {
    render(<Navbar user={registeredUser} onLogout={mockLogout} />);

    expect(screen.getByText(/mario/i)).toBeInTheDocument();
    expect(screen.getByText(/rossi/i)).toBeInTheDocument();
  });

  test('click su "Esci" chiama onLogout', async () => {
    render(<Navbar user={registeredUser} onLogout={mockLogout} />);

    fireEvent.click(screen.getByRole('button', { name: /mario/i }));

    const logoutBtn = await screen.findByText(/esci/i);
    fireEvent.click(logoutBtn);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('il dropdown si chiude cliccando sull\'overlay', async () => {
    render(<Navbar user={registeredUser} onLogout={mockLogout} />);

    // Apri dropdown
    fireEvent.click(screen.getByRole('button', { name: /mario/i }));
    expect(await screen.findByText(/profilo utente/i)).toBeInTheDocument();

    // Clicca sull'overlay (div fixed inset-0)
    const overlay = document.querySelector('.fixed.inset-0');
    expect(overlay).toBeTruthy();
    fireEvent.click(overlay!);

    // Dopo il click sull'overlay, il dropdown deve essere chiuso
    expect(screen.queryByText(/profilo utente/i)).not.toBeInTheDocument();
  });

  test('mostra "(Registrati)" accanto a Profilo Utente per un ospite', async () => {
    render(<Navbar user={guestUser} onLogout={mockLogout} />);

    fireEvent.click(screen.getByRole('button', { name: /ospite/i }));

    expect(await screen.findByText(/\(registrati\)/i)).toBeInTheDocument();
  });

  test('la voce "Ordini" è sempre cliccabile per un utente registrato', async () => {
    render(<Navbar user={registeredUser} onLogout={mockLogout} />);

    fireEvent.click(screen.getByRole('button', { name: /mario/i }));
    const ordiniEl = await screen.findByText('Ordini');
    const link = ordiniEl.closest('a');
    expect(link).toHaveAttribute('href', '/orders');
    expect(link).not.toHaveClass('cursor-not-allowed');
  });

  test('la voce "Ordini" non è visibile per un ospite', async () => {
    render(<Navbar user={guestUser} onLogout={mockLogout} />);

    fireEvent.click(screen.getByRole('button', { name: /ospite/i }));
    await screen.findByText(/profilo utente/i);

    expect(screen.queryByText('Ordini')).not.toBeInTheDocument();
  });
});