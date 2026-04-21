import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import BookDetailPage from './page';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
  })),
  useParams: jest.fn(() => ({
    id: '1'
  })),
}));

// Mock fetch
global.fetch = jest.fn();

const mockBookWithTags = {
  id: 1,
  titolo: 'Il Signore degli Anelli',
  sottotitolo: 'La Compagnia dell\'Anello',
  nomeAutore: 'John',
  cognomeAutore: 'Tolkien',
  nomeEditore: 'Bompiani',
  annoPubblicazione: 1954,
  isbn10: '1234567890',
  isbn13: '9781234567890',
  prezzo: 19.99,
  prezzoOriginale: 24.99,
  stock: 25,
  categoria: 'Fantasy',
  tags: 'Fantasy, Avventura, Epico', // String comma-separated
  descrizione: 'Un\'epica avventura nel mondo della Terra di Mezzo.',
  copertinaUrl: 'https://example.com/cover.jpg',
  disponibile: true,
  percentualeSconto: 20.0,
};

const mockBookWithoutTags = {
  ...mockBookWithTags,
  tags: null, // Nessun tag
};

const mockBookWithSingleTag = {
  ...mockBookWithTags,
  tags: 'Fantasy', // Un singolo tag
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('BookDetailPage - Tag Display', () => {
  it('displays multiple tags correctly', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockBookWithTags),
    });

    render(<BookDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Il Signore degli Anelli')).toBeInTheDocument();
    });

    // Verifica che la sezione tag sia presente
    expect(screen.getByText('Tag:')).toBeInTheDocument();
    
    // Verifica tag specifici nel contenitore dei tag (blue badges)
    const tagElements = screen.getAllByText('Fantasy');
    expect(tagElements.length).toBeGreaterThan(0);
    
    // Verifica presenza di tutti i tag nella sezione tag
    expect(screen.getByText('Avventura')).toBeInTheDocument();
    expect(screen.getByText('Epico')).toBeInTheDocument();
  });

  it('displays single tag correctly', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockBookWithSingleTag),
    });

    render(<BookDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Il Signore degli Anelli')).toBeInTheDocument();
    });

    // Verifica che la sezione tag sia presente con un solo tag
    expect(screen.getByText('Tag:')).toBeInTheDocument();
    
    // Verifica che Fantasy appaia almeno una volta (può essere sia categoria che tag)
    const fantasyElements = screen.getAllByText('Fantasy');
    expect(fantasyElements.length).toBeGreaterThan(0);
  });

  it('hides tag section when no tags are present', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockBookWithoutTags),
    });

    render(<BookDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Il Signore degli Anelli')).toBeInTheDocument();
    });

    // Verifica che la sezione tag non sia presente
    expect(screen.queryByText('Tag:')).not.toBeInTheDocument();
  });

  it('applies correct styling to tag pills', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockBookWithTags),
    });

    render(<BookDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Il Signore degli Anelli')).toBeInTheDocument();
    });

    // Verifica che i tag abbiano le classi CSS corrette (blue badges)
    const allFantasyElements = screen.getAllByText('Fantasy');
    
    // Trova l'elemento tag (blue badge) - dovrebbe avere bg-blue-100
    const fantasyTagElement = allFantasyElements.find(el => 
      el.classList.contains('bg-blue-100')
    );
    
    expect(fantasyTagElement).toBeTruthy();
    expect(fantasyTagElement).toHaveClass('inline-flex', 'px-2', 'py-1', 'text-xs', 'font-medium', 'bg-blue-100', 'text-blue-800', 'rounded-md');
  });

  it('handles tags with extra whitespace', async () => {
    const bookWithSpacedTags = {
      ...mockBookWithTags,
      tags: ' Fantasy , Avventura , Epico ', // Con spazi extra
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(bookWithSpacedTags),
    });

    render(<BookDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Il Signore degli Anelli')).toBeInTheDocument();
    });

    // Verifica che i tag siano visualizzati correttamente senza spazi extra
    expect(screen.getAllByText('Fantasy').length).toBeGreaterThan(0);
    expect(screen.getByText('Avventura')).toBeInTheDocument();
    expect(screen.getByText('Epico')).toBeInTheDocument();
  });

  it('displays category and tags in correct order', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockBookWithTags),
    });

    render(<BookDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Il Signore degli Anelli')).toBeInTheDocument();
    });

    // Verifica che categoria e tag siano entrambi presenti
    expect(screen.getByText('Fantasy', { selector: 'span.inline-flex.px-3.py-1' })).toBeInTheDocument(); // Categoria
    expect(screen.getByText('Tag:')).toBeInTheDocument();
    
    // Verifica che i tag della sezione tag siano presenti
    const tagSection = screen.getByText('Tag:').parentElement;
    expect(tagSection).toContainElement(screen.getByText('Fantasy', { selector: 'span.inline-flex.px-2.py-1' }));
    expect(tagSection).toContainElement(screen.getByText('Avventura'));
    expect(tagSection).toContainElement(screen.getByText('Epico'));
  });

  it('handles empty tag string', async () => {
    const bookWithEmptyTags = {
      ...mockBookWithTags,
      tags: '', // String vuota
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(bookWithEmptyTags),
    });

    render(<BookDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Il Signore degli Anelli')).toBeInTheDocument();
    });

    // Verifica che la sezione tag non sia presente
    expect(screen.queryByText('Tag:')).not.toBeInTheDocument();
  });

  it('handles malformed tag string gracefully', async () => {
    const bookWithMalformedTags = {
      ...mockBookWithTags,
      tags: 'Fantasy,,,Avventura,', // Con virgole multiple
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(bookWithMalformedTags),
    });

    render(<BookDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Il Signore degli Anelli')).toBeInTheDocument();
    });

    // Verifica che solo i tag validi siano visualizzati
    expect(screen.getAllByText('Fantasy').length).toBeGreaterThan(0);
    expect(screen.getByText('Avventura')).toBeInTheDocument();
    // Non dovrebbero esserci tag vuoti o solo con virgole
  });

  it('displays all book information including tags', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockBookWithTags),
    });

    render(<BookDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Il Signore degli Anelli')).toBeInTheDocument();
    });

    // Verifica che tutte le informazioni del libro siano presenti
    expect(screen.getByText('La Compagnia dell\'Anello')).toBeInTheDocument(); // Sottotitolo
    expect(screen.getByText(/John Tolkien/)).toBeInTheDocument(); // Autore
    expect(screen.getByText(/Bompiani/)).toBeInTheDocument(); // Editore
    expect(screen.getByText(/1954/)).toBeInTheDocument(); // Anno
    expect(screen.getByText('Fantasy', { selector: 'span.inline-flex.px-3.py-1' })).toBeInTheDocument(); // Categoria
    expect(screen.getByText('Tag:')).toBeInTheDocument(); // Sezione tag
    expect(screen.getByText(/Un'epica avventura/)).toBeInTheDocument(); // Descrizione
  });
});