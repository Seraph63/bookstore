import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthScreen from './AuthScreen';
import '@testing-library/jest-dom';

describe('AuthScreen', () => {
  const mockLoginSuccess = jest.fn();
  const mockGuestLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, email: 'test@example.com' }),
      })
    );
  });

  test('login con successo chiama onLoginSuccess', async () => {
    render(<AuthScreen onLoginSuccess={mockLoginSuccess} onGuestLogin={mockGuestLogin} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'Password123');
    await user.click(screen.getByRole('button', { name: /accedi/i }));

    await waitFor(() => {
      expect(mockLoginSuccess).toHaveBeenCalled();
    });
  });

  test('bottone disabilitato con campi vuoti', () => {
    render(<AuthScreen onLoginSuccess={mockLoginSuccess} onGuestLogin={mockGuestLogin} />);

    const submitBtn = screen.getByRole('button', { name: /accedi/i });
    expect(submitBtn).toBeDisabled();
  });

  test('bottone abilitato quando email e password sono compilati', async () => {
    render(<AuthScreen onLoginSuccess={mockLoginSuccess} onGuestLogin={mockGuestLogin} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'Password123');

    expect(screen.getByRole('button', { name: /accedi/i })).toBeEnabled();
  });

  test('toggle a modalità registrazione mostra campi nome e cognome', async () => {
    render(<AuthScreen onLoginSuccess={mockLoginSuccess} onGuestLogin={mockGuestLogin} />);
    const user = userEvent.setup();

    // In modalità login, i campi nome/cognome non devono essere presenti
    expect(screen.queryByPlaceholderText(/^nome$/i)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/^cognome$/i)).not.toBeInTheDocument();

    // Toggle alla registrazione
    await user.click(screen.getByRole('button', { name: /non hai un account/i }));

    expect(screen.getByPlaceholderText(/^nome$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^cognome$/i)).toBeInTheDocument();
    expect(screen.getByText(/crea account/i)).toBeInTheDocument();
  });

  test('bottone disabilitato in registrazione se nome/cognome vuoti', async () => {
    render(<AuthScreen onLoginSuccess={mockLoginSuccess} onGuestLogin={mockGuestLogin} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /non hai un account/i }));

    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'Password123');

    // Nome e cognome vuoti → bottone disabilitato
    expect(screen.getByRole('button', { name: /registrati/i })).toBeDisabled();
  });

  test('mostra errore dal server quando la risposta non è ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Credenziali errate' }),
    });

    render(<AuthScreen onLoginSuccess={mockLoginSuccess} onGuestLogin={mockGuestLogin} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /accedi/i }));

    await waitFor(() => {
      expect(screen.getByText('Credenziali errate')).toBeInTheDocument();
    });
    expect(mockLoginSuccess).not.toHaveBeenCalled();
  });

  test('mostra errore di connessione quando fetch fallisce', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<AuthScreen onLoginSuccess={mockLoginSuccess} onGuestLogin={mockGuestLogin} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'Password123');
    await user.click(screen.getByRole('button', { name: /accedi/i }));

    await waitFor(() => {
      expect(screen.getByText('Errore di connessione al server')).toBeInTheDocument();
    });
  });

  test('click su "Entra come Ospite" chiama onGuestLogin', async () => {
    render(<AuthScreen onLoginSuccess={mockLoginSuccess} onGuestLogin={mockGuestLogin} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /entra come ospite/i }));

    expect(mockGuestLogin).toHaveBeenCalledTimes(1);
  });

  test('reset errore quando si cambia modalità', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Credenziali errate' }),
    });

    render(<AuthScreen onLoginSuccess={mockLoginSuccess} onGuestLogin={mockGuestLogin} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /accedi/i }));

    await waitFor(() => {
      expect(screen.getByText('Credenziali errate')).toBeInTheDocument();
    });

    // Toggle a registrazione → errore deve sparire
    await user.click(screen.getByRole('button', { name: /non hai un account/i }));

    expect(screen.queryByText('Credenziali errate')).not.toBeInTheDocument();
  });
});