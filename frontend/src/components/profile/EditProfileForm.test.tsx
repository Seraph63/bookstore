import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditProfileForm from './EditProfileForm';
import '@testing-library/jest-dom';
import { toast } from 'sonner';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('EditProfileForm', () => {
  const mockUser = {
    id: 1,
    nome: 'Mario',
    cognome: 'Rossi',
    email: 'mario@test.it'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.setItem = jest.fn();
  });

  test('permette di modificare il nome, cognome e email', async () => {
    render(<EditProfileForm initialData={mockUser} />);
    const user = userEvent.setup();

    const nomeInput = screen.getByRole('textbox', { name: /^nome$/i });
    const cognomeInput = screen.getByRole('textbox', { name: /^cognome$/i });
    const emailInput = screen.getByRole('textbox', { name: /^email$/i });

    await user.clear(nomeInput);
    await user.type(nomeInput, 'Giovanni');

    await user.clear(cognomeInput);
    await user.type(cognomeInput, 'Verdi');

    await user.clear(emailInput);
    await user.type(emailInput, 'g.verdi@email.it');

    expect(nomeInput).toHaveValue('Giovanni');
    expect(cognomeInput).toHaveValue('Verdi');
    expect(emailInput).toHaveValue('g.verdi@email.it');
  });

  test('submit con successo aggiorna localStorage e fa redirect', async () => {
    const updatedUser = { ...mockUser, nome: 'Giovanni' };
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(updatedUser),
      })
    );

    render(<EditProfileForm initialData={mockUser} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /salva modifiche/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:8080/api/users/${mockUser.id}`,
        expect.objectContaining({ method: 'PUT' })
      );
    });

    await waitFor(() => {
      expect(Storage.prototype.setItem).toHaveBeenCalledWith('user', JSON.stringify(updatedUser));
      expect(mockPush).toHaveBeenCalledWith('/profile?updated=true');
    });
  });

  test('mostra toast di errore quando il server risponde con errore', async () => {
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    render(<EditProfileForm initialData={mockUser} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /salva modifiche/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Errore durante il salvataggio. Riprova.');
    });
  });

  test('mostra toast di errore quando la rete fallisce', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (global.fetch as jest.Mock) = jest.fn(() => Promise.reject(new Error('Network error')));

    render(<EditProfileForm initialData={mockUser} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /salva modifiche/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Impossibile raggiungere il server.');
    });
    consoleErrorSpy.mockRestore();
  });

  test('renderizza i campi con i dati iniziali', () => {
    render(<EditProfileForm initialData={mockUser} />);

    expect(screen.getByRole('textbox', { name: /^nome$/i })).toHaveValue('Mario');
    expect(screen.getByRole('textbox', { name: /^cognome$/i })).toHaveValue('Rossi');
    expect(screen.getByRole('textbox', { name: /^email$/i })).toHaveValue('mario@test.it');
  });
});