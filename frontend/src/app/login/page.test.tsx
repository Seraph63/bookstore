import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './page';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock di next/dynamic per rendere AuthScreen sincrono nei test
jest.mock('next/dynamic', () => () => {
  const AuthScreen = require('@/components/auth/AuthScreen').default;
  return AuthScreen;
});

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.setItem = jest.fn();

    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, nome: 'Mario', cognome: 'Rossi', email: 'mario@test.it' }),
      })
    );
  });

  test('dopo login salva utente in localStorage e setta cookie', async () => {
    render(<LoginPage />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), 'mario@test.it');
    await user.type(screen.getByPlaceholderText(/password/i), 'Password123');
    await user.click(screen.getByRole('button', { name: /accedi/i }));

    await waitFor(() => {
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'user',
        expect.stringContaining('mario@test.it')
      );
    });

    expect(document.cookie).toContain('auth_session=true');
  });

  test('accesso ospite salva utente guest e setta cookie', async () => {
    render(<LoginPage />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /entra come ospite/i }));

    expect(Storage.prototype.setItem).toHaveBeenCalledWith(
      'user',
      expect.stringContaining('Ospite')
    );
    expect(document.cookie).toContain('auth_session=true');
  });
});
