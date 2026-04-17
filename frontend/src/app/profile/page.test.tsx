import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfilePage from './page';
import '@testing-library/jest-dom';

const mockPush = jest.fn();
const mockGet = jest.fn(() => null);
const mockRouter = { push: mockPush };
const mockSearchParams = { get: mockGet };

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => mockSearchParams,
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('ProfilePage', () => {
  const mockUser = { id: 1, nome: 'Mario', cognome: 'Rossi', email: 'mario@test.it', isGuest: false };

  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'user') return JSON.stringify(mockUser);
      return null;
    });
    Storage.prototype.removeItem = jest.fn();
  });

  test('mostra i dati dell\'utente registrato', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getAllByText(/mario/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/rossi/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('mario@test.it')).toBeInTheDocument();
    });
  });

  test('mostra "Utente Registrato" per utente non guest', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Utente Registrato')).toBeInTheDocument();
    });
  });

  test('mostra "Ospite" per utente guest', async () => {
    const guestUser = { id: 999, nome: 'Ospite', cognome: '', email: 'guest@example.com', isGuest: true };
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'user') return JSON.stringify(guestUser);
      return null;
    });

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getAllByText(/ospite/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  test('redirect a "/" se non c\'è utente in localStorage', async () => {
    Storage.prototype.getItem = jest.fn(() => null);

    render(<ProfilePage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  test('contiene link "Modifica Profilo"', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText(/modifica profilo/i)).toBeInTheDocument();
    });
  });

  test('"Torna al Catalogo" naviga a "/"', async () => {
    render(<ProfilePage />);
    const user = userEvent.setup();

    const backBtn = await screen.findByText(/torna al catalogo/i);
    await user.click(backBtn);

    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
