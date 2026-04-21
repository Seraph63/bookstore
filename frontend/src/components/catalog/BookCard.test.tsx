import { render, screen, fireEvent } from '@testing-library/react';
import BookCard from './BookCard';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
  })),
}));

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

describe('BookCard', () => {
  const mockBook = {
    id: 1,
    titolo: "Il Piccolo Principe",
    nomeAutore: "Antoine",
    cognomeAutore: "de Saint-Exupéry",
    prezzo: 7.65,
    categoria: "Ragazzi",
    copertina_url: "https://picsum.photos/seed/9/400/600",
    stock: 5
  };

  test('visualizza correttamente titolo, autore, prezzo e copertina', () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText(mockBook.titolo)).toBeInTheDocument();

    expect(screen.getByText((content) => {
      return content.includes(mockBook.nomeAutore) && content.includes(mockBook.cognomeAutore);
    })).toBeInTheDocument();

    expect(screen.getByText(/7.65/)).toBeInTheDocument();
  });

  test('mostra "Autore Sconosciuto" quando nomeAutore è null', () => {
    const bookSenzaAutore = { ...mockBook, nomeAutore: null, cognomeAutore: null };
    render(<BookCard book={bookSenzaAutore} />);

    expect(screen.getByText('Autore Sconosciuto')).toBeInTheDocument();
  });

  test('mostra "Autore Sconosciuto" quando nomeAutore è undefined', () => {
    const bookAutoreVuoto = { ...mockBook, nomeAutore: undefined, cognomeAutore: undefined };
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

    expect(img.src).toContain('picsum.photos');
  });

  test('usa immagine di default quando copertina_url è assente', () => {
    const bookSenzaCover = { ...mockBook, copertina_url: undefined };
    render(<BookCard book={bookSenzaCover} />);

    const img = screen.getByAltText(mockBook.titolo) as HTMLImageElement;
    expect(img.src).toContain('picsum.photos');
  });

  test('mostra quantità disponibile quando stock > 0', () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText('Disponibili: 5')).toBeInTheDocument();
  });

  test('mostra "Non disponibile" quando stock è 0', () => {
    const bookEsaurito = { ...mockBook, stock: 0 };
    render(<BookCard book={bookEsaurito} />);

    expect(screen.getByText('Non disponibile')).toBeInTheDocument();
  });

  test('mostra icona carrello per utente registrato', () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByLabelText('Aggiungi al carrello')).toBeInTheDocument();
  });

  test('non mostra icona carrello per utente guest', () => {
    render(<BookCard book={mockBook} isGuest={true} />);

    expect(screen.queryByLabelText('Aggiungi al carrello')).not.toBeInTheDocument();
  });

  test('non mostra icona modifica per utente non admin', () => {
    render(<BookCard book={mockBook} />);

    expect(screen.queryByLabelText('Modifica libro')).not.toBeInTheDocument();
  });

  test('mostra icona modifica per utente admin', () => {
    render(<BookCard book={mockBook} isAdmin={true} />);

    expect(screen.getByLabelText('Modifica libro')).toBeInTheDocument();
  });

  test('admin vede sia icona carrello che icona modifica', () => {
    render(<BookCard book={mockBook} isAdmin={true} />);

    expect(screen.getByLabelText('Aggiungi al carrello')).toBeInTheDocument();
    expect(screen.getByLabelText('Modifica libro')).toBeInTheDocument();
  });
});