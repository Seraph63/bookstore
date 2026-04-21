import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import BookForm from './BookForm';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

const mockPush = jest.fn();
const mockBack = jest.fn();

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
    back: mockBack,
  });

  // Reset all mocks
  jest.clearAllMocks();
  
  // Mock successful API responses by default
  (fetch as jest.Mock).mockImplementation((url: string) => {
    if (url.includes('/api/authors')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, nome: 'Test', cognome: 'Author' },
          { id: 2, nome: 'Another', cognome: 'Writer' },
        ])
      });
    }
    if (url.includes('/api/publishers')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, nome: 'Test Publisher', sede: 'Milan' },
          { id: 2, nome: 'Another Publisher', sede: 'Rome' },
        ])
      });
    }
    if (url.includes('/api/categories')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, descrizione: 'Fiction' },
          { id: 2, descrizione: 'Non-Fiction' },
        ])
      });
    }
    if (url.includes('/api/tag')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, descrizione: 'Fantasy' },
          { id: 2, descrizione: 'Avventura' },
          { id: 3, descrizione: 'Mistero' },
          { id: 4, descrizione: 'Sci-Fi' },
        ])
      });
    }
    return Promise.reject(new Error('Unknown API endpoint'));
  });
});

describe('BookForm', () => {
  it('renders create form with tag functionality', async () => {
    render(<BookForm mode="create" />);

    await waitFor(() => {
      expect(screen.getByText('Inserisci Nuovo Libro')).toBeInTheDocument();
      expect(screen.getByLabelText(/Titolo/)).toBeInTheDocument();
      expect(screen.getByText('Tag')).toBeInTheDocument();
    });
  });

  it('loads and displays available tags in dropdown', async () => {
    render(<BookForm mode="create" />);

    await waitFor(() => {
      expect(screen.getByText('Tag')).toBeInTheDocument();
      // Verifica che ci sia il dropdown per aggiungere tag
      expect(screen.getByDisplayValue('+ Aggiungi tag...')).toBeInTheDocument();
    });
  });

  it('allows adding tags from dropdown', async () => {
    render(<BookForm mode="create" />);

    await waitFor(() => {
      const tagDropdown = screen.getByDisplayValue('+ Aggiungi tag...');
      return tagDropdown;
    });

    // Seleziona un tag dal dropdown
    const tagDropdown = screen.getByDisplayValue('+ Aggiungi tag...');
    fireEvent.change(tagDropdown, { target: { value: '1' } }); // Fantasy ID

    // Verifica che il tag sia stato aggiunto
    await waitFor(() => {
      expect(screen.getByText('Fantasy')).toBeInTheDocument();
      // Verifica che ci sia il pulsante X per rimuovere il tag
      expect(screen.getByText('×')).toBeInTheDocument();
    });
  });

  it('allows removing tags', async () => {
    render(<BookForm mode="create" />);

    // Aggiungi prima un tag
    await waitFor(() => {
      const tagDropdown = screen.getByDisplayValue('+ Aggiungi tag...');
      fireEvent.change(tagDropdown, { target: { value: '1' } }); // Fantasy
      return screen.findByText('Fantasy');
    });

    // Verifica che il tag sia presente come pill
    expect(screen.getByText('Fantasy')).toBeInTheDocument();

    // Rimuovi il tag cliccando su X
    const removeButton = screen.getByText('×');
    fireEvent.click(removeButton);

    // Verifica che il tag pill sia stato rimosso e che appaia il messaggio "nessun tag"
    await waitFor(() => {
      expect(screen.getByText('Nessun tag selezionato')).toBeInTheDocument();
    });

    // Verifica che Fantasy sia di nuovo disponibile nel dropdown come opzione
    await waitFor(() => {
      const fantasyOption = screen.getByRole('option', { name: 'Fantasy' });
      expect(fantasyOption).toBeInTheDocument();
    });
  });

  it('prevents adding duplicate tags', async () => {
    render(<BookForm mode="create" />);

    // Aggiungi il primo tag
    await waitFor(() => {
      const tagDropdown = screen.getByDisplayValue('+ Aggiungi tag...');
      fireEvent.change(tagDropdown, { target: { value: '1' } }); // Fantasy
      return screen.findByText('Fantasy');
    });

    // Verifica che Fantasy non sia più nel dropdown
    await waitFor(() => {
      const tagDropdown = screen.getByDisplayValue('+ Aggiungi tag...');
      // Il Fantasy dovrebbe essere rimosso dalle opzioni disponibili
      expect(screen.queryByRole('option', { name: 'Fantasy' })).not.toBeInTheDocument();
    });
  });

  it('shows message when no tags selected', async () => {
    render(<BookForm mode="create" />);

    await waitFor(() => {
      expect(screen.getByText('Nessun tag selezionato')).toBeInTheDocument();
    });
  });

  it('hides dropdown when all tags are selected', async () => {
    render(<BookForm mode="create" />);

    await waitFor(() => {
      const tagDropdown = screen.getByDisplayValue('+ Aggiungi tag...');
      
      // Aggiungi tutti i tag disponibili
      fireEvent.change(tagDropdown, { target: { value: '1' } }); // Fantasy
      return screen.findByText('Fantasy');
    });

    await waitFor(() => {
      const tagDropdown = screen.getByDisplayValue('+ Aggiungi tag...');
      fireEvent.change(tagDropdown, { target: { value: '2' } }); // Avventura
      return screen.findByText('Avventura');
    });

    await waitFor(() => {
      const tagDropdown = screen.getByDisplayValue('+ Aggiungi tag...');
      fireEvent.change(tagDropdown, { target: { value: '3' } }); // Mistero
      return screen.findByText('Mistero');
    });

    await waitFor(() => {
      const tagDropdown = screen.getByDisplayValue('+ Aggiungi tag...');
      fireEvent.change(tagDropdown, { target: { value: '4' } }); // Sci-Fi
      return screen.findByText('Sci-Fi');
    });

    // Quando tutti i tag sono selezionati, il dropdown dovrebbe essere nascosto
    await waitFor(() => {
      expect(screen.queryByDisplayValue('+ Aggiungi tag...')).not.toBeInTheDocument();
    });
  });

  it('loads initial tags when editing existing book', async () => {
    const initialData = {
      id: 1,
      titolo: 'Test Book',
      tags: 'Fantasy, Mistero', // String comma-separated come dal backend
      tagIds: [1, 3], // Array di ID
      // ... altri campi
    };

    render(<BookForm mode="edit" bookId={1} initialData={initialData} />);

    await waitFor(() => {
      // Verifica che i tag iniziali siano caricati
      expect(screen.getByText('Fantasy')).toBeInTheDocument();
      expect(screen.getByText('Mistero')).toBeInTheDocument();
    });
  });

  it('submits form with selected tags', async () => {
    const mockFetch = fetch as jest.Mock;
    mockFetch.mockImplementation((url: string, options?: any) => {
      if (options?.method === 'POST' && url.includes('/api/books')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 1, titolo: 'Test Book' }),
        });
      }
      // Default mocks for GET requests remain the same
      if (url.includes('/api/authors')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, nome: 'Test', cognome: 'Author' },
          ])
        });
      }
      if (url.includes('/api/publishers')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, nome: 'Test Publisher' },
          ])
        });
      }
      if (url.includes('/api/categories')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, descrizione: 'Fiction' },
          ])
        });
      }
      if (url.includes('/api/tag')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, descrizione: 'Fantasy' },
          ])
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });

    render(<BookForm mode="create" />);

    // Aspetta che il form sia caricato
    await waitFor(() => {
      expect(screen.getByLabelText(/Titolo/)).toBeInTheDocument();
    });

    // Compila i campi richiesti
    fireEvent.change(screen.getByLabelText(/Titolo/), { target: { value: 'Test Book' } });
    fireEvent.change(screen.getByLabelText(/ISBN-13/), { target: { value: '1234567890123' } });
    fireEvent.change(screen.getByLabelText(/Prezzo \(€\)/), { target: { value: '19.99' } });
    fireEvent.change(screen.getByLabelText(/Stock/), { target: { value: '10' } });

    // Seleziona autore, editore, categoria
    await waitFor(() => {
      const authorSelect = screen.getByLabelText(/Seleziona Autore/);
      const publisherSelect = screen.getByLabelText(/Seleziona Editore/);  
      const categorySelect = screen.getByLabelText(/Categoria/);
      
      fireEvent.change(authorSelect, { target: { value: '1' } });
      fireEvent.change(publisherSelect, { target: { value: '1' } });
      fireEvent.change(categorySelect, { target: { value: '1' } });
    });

    // Aggiungi tag
    const tagDropdown = screen.getByDisplayValue('+ Aggiungi tag...');
    fireEvent.change(tagDropdown, { target: { value: '1' } }); // Fantasy

    // Submit il form
    fireEvent.click(screen.getByText('Crea Libro'));

    // Verifica che la chiamata API includa i tag
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/books'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"tagIds":[1]'), // Verifica che i tag siano inclusi
        })
      );
    });
  });

  it('handles API errors when loading tags', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    (fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/tag')) {
        return Promise.resolve({
          ok: false,
          status: 500,
        });
      }
      // Altri endpoint funzionano normalmente
      if (url.includes('/api/authors')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      if (url.includes('/api/publishers')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      if (url.includes('/api/categories')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });

    render(<BookForm mode="create" />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled();
    });

    consoleError.mockRestore();
  });
});