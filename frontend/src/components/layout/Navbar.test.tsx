import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';
import '@testing-library/jest-dom';

describe('Navbar - Gestione Utente Guest', () => {
  const mockLogout = jest.fn();

  test('il tasto "Profilo" deve essere disabilitato se l\'utente è un Ospite', async () => {
    const guestUser = { id: 999, nome: 'Ospite', cognome: 'User', email: 'guest@test.it', isGuest: true };
    render(<Navbar user={guestUser} onLogout={jest.fn()} />);

    // STEP A: Clicca sul pulsante dell'utente per aprire il dropdown
    // Cerchiamo il pulsante che contiene il nome "Ospite"
    const userButton = screen.getByRole('button', { name: /ospite/i });
    fireEvent.click(userButton);

    // STEP B: Ora il testo "Profilo Utente" dovrebbe essere visibile
    const profileLink = await screen.findByText(/profilo utente/i);
    const container = profileLink.closest('a') || profileLink.closest('button');

    expect(container).toHaveClass('pointer-events-none');
    expect(container).toHaveClass('text-gray-400');
  });

  test('il tasto "Profilo" deve essere abilitato per un utente registrato', async () => {
    const user = { id: 1, nome: 'Mario', cognome: 'Rossi', email: 'mario@test.it', isGuest: false };
    render(<Navbar user={user} onLogout={jest.fn()} />);

    // STEP A: Apri il dropdown cliccando sul nome "Mario"
    const userButton = screen.getByRole('button', { name: /mario/i });
    fireEvent.click(userButton);

    // STEP B: Cerca il link profilo
    const profileLink = await screen.findByText(/profilo utente/i);
    const container = profileLink.closest('a') || profileLink.closest('button');

    expect(container).toBeInTheDocument();
    expect(container).not.toHaveClass('pointer-events-none');
  });
});