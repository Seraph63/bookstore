import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';
import '@testing-library/jest-dom';

describe('Navbar - Gestione Utente Guest', () => {
  const mockLogout = jest.fn();

  test('il tasto "Profilo" deve essere disabilitato se l\'utente è un Ospite', () => {
    const guestUser = { nome: 'Ospite', cognome: '', isGuest: true };

    render(<Navbar user={guestUser} onLogout={mockLogout} />);
    
    // 1. Troviamo e clicchiamo il bottone del menu (quello con scritto "Ospite")
    const menuBtn = screen.getByRole('button', { name: /ospite/i });
    fireEvent.click(menuBtn);

    // 2. Ora che il menu è aperto, cerchiamo il tasto Profilo
    // Usiamo getByText perché il bottone contiene del testo specifico
    const profileBtn = screen.getByText(/profilo utente/i).closest('button');
    
    expect(profileBtn).toBeDisabled();
    expect(profileBtn).toHaveClass('cursor-not-allowed');
  });

  test('il tasto "Profilo" deve essere abilitato per un utente registrato', () => {
    const regularUser = { nome: 'Mario', cognome: 'Rossi', isGuest: false };

    render(<Navbar user={regularUser} onLogout={mockLogout} />);
    
    // Apriamo il menu cliccando sul nome dell'utente
    const menuBtn = screen.getByRole('button', { name: /mario rossi/i });
    fireEvent.click(menuBtn);

    const profileBtn = screen.getByText(/profilo utente/i).closest('button');
    
    expect(profileBtn).toBeEnabled();
    expect(profileBtn).not.toHaveClass('cursor-not-allowed');
  });
});