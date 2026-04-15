import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditProfilePage from '../../app/profile/edit/page';

// 1. Mock completo di next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

describe('Pagina Modifica Profilo', () => {
  beforeEach(() => {
    // 2. Mock del localStorage per evitare il loop di caricamento
    const mockUser = {
      id: 1,
      nome: 'Mario',
      cognome: 'Rossi',
      email: 'mario@test.it'
    };
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => JSON.stringify(mockUser)),
        setItem: jest.fn(),
      },
      writable: true,
    });
  });

  test('permette di modificare il nome, cognome e email', async () => {
    render(<EditProfilePage />);
    const user = userEvent.setup();

    // 3. Usiamo findBy invece di getBy per aspettare che sparisca la scritta "Caricamento"
    const nomeInput = await screen.findByRole('textbox', { name: /^nome$/i });
    const cognomeInput = await screen.findByRole('textbox', { name: /^cognome$/i });
    const emailInput = await screen.findByRole('textbox', { name: /^email$/i });

    // Puliamo e scriviamo nuovi dati
    await user.clear(nomeInput);
    await user.type(nomeInput, 'Giovanni');

    await user.clear(cognomeInput);
    await user.type(cognomeInput, 'Verdi');

    await user.clear(emailInput);
    await user.type(emailInput, 'g.verdi@email.it');

    // 4. Assert corretti
    expect(nomeInput).toHaveValue('Giovanni');
    expect(cognomeInput).toHaveValue('Verdi');
    expect(emailInput).toHaveValue('g.verdi@email.it');
  });
});