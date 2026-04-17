import { render, screen, fireEvent } from '@testing-library/react';
import BookCard from './BookCard';
import '@testing-library/jest-dom';

describe('BookCard', () => {
  const mockBook = {
    titolo: "Il Piccolo Principe",
    autore: {
      nome: "Antoine",
      cognome: "de Saint-Exupéry"
    },
    prezzo: 7.65,
    categoria: "Ragazzi",
    copertina_url: "https://picsum.photos/seed/9/400/600"
  };

  test('visualizza correttamente titolo, autore, prezzo e copertina', () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText(mockBook.titolo)).toBeInTheDocument();

    expect(screen.getByText((content) => {
      return content.includes(mockBook.autore.nome) && content.includes(mockBook.autore.cognome);
    })).toBeInTheDocument();

    expect(screen.getByText(/7.65/)).toBeInTheDocument();
  });

  test('mostra "Autore Sconosciuto" quando autore è null', () => {
    const bookSenzaAutore = { ...mockBook, autore: null };
    render(<BookCard book={bookSenzaAutore} />);

    expect(screen.getByText('Autore Sconosciuto')).toBeInTheDocument();
  });

  test('mostra "Autore Sconosciuto" quando autore.nome è undefined', () => {
    const bookAutoreVuoto = { ...mockBook, autore: { nome: undefined, cognome: undefined } };
    render(<BookCard book={bookAutoreVuoto} />);

    expect(screen.getByText('Autore Sconosciuto')).toBeInTheDocument();
  });

  test('visualizza il badge categoria', () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText('Ragazzi')).toBeInTheDocument();
  });

  test('immagine di fallback su errore di caricamento', () => {
    render(<BookCard book={mockBook} />);

    const img = screen.getByAltText(mockBook.titolo) as HTMLImageElement;
    fireEvent.error(img);

    expect(img.src).toContain('unsplash.com');
  });

  test('usa immagine di default quando copertina_url è assente', () => {
    const bookSenzaCover = { ...mockBook, copertina_url: undefined };
    render(<BookCard book={bookSenzaCover} />);

    const img = screen.getByAltText(mockBook.titolo) as HTMLImageElement;
    expect(img.src).toContain('unsplash.com');
  });
});