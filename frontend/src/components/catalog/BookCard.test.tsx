import { render, screen } from '@testing-library/react';
import BookCard from './BookCard';
import '@testing-library/jest-dom';

describe('BookCard - Visualizzazione Dati', () => {
  const mockBook = {
    titolo: "Il Piccolo Principe",
    autore: "Antoine de Saint-Exupéry",
    prezzo: 7.65,
    copertina_url: "https://picsum.photos/seed/9/400/600"
  };

  test('visualizza correttamente titolo, autore, prezzo e copertina', () => {
    render(<BookCard book={mockBook} />);

    // 1. Verifica Titolo
    const titleElement = screen.getByText(mockBook.titolo);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.tagName).toBe('H3');

    // 2. Verifica Autore
    expect(screen.getByText(mockBook.autore)).toBeInTheDocument();

    // 3. Verifica Prezzo (formattato)
    // Usiamo una regex perché il prezzo potrebbe avere il simbolo € o spazi
    expect(screen.getByText(/7.65/)).toBeInTheDocument();

    // 4. Verifica Copertina (Immagine)
    const coverImage = screen.getByRole('img');
    expect(coverImage).toHaveAttribute('src', mockBook.copertina_url);
    // È buona norma verificare anche l'alt text per l'accessibilità
    expect(coverImage).toHaveAttribute('alt', mockBook.titolo);
  });
});