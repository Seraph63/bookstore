import { render, screen, fireEvent } from '@testing-library/react';
import CartDrawer from './CartDrawer';

// Mock del CartContext
const mockUseCart = {
  items: [],
  itemCount: 0,
  total: 0,
  updateQuantity: jest.fn(),
  removeItem: jest.fn(),
  clearCart: jest.fn(),
  checkout: jest.fn().mockResolvedValue({ id: 1 }),
};

jest.mock('@/context/CartContext', () => ({
  useCart: () => mockUseCart,
}));

describe('CartDrawer', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('mostra stato vuoto quando non ci sono items', () => {
    render(<CartDrawer isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Il carrello è vuoto')).toBeInTheDocument();
  });

  it('mostra il conteggio articoli nell\'header', () => {
    mockUseCart.items = [
      { id: 1, book: { id: 1, titolo: 'Test Book', prezzo: 10, autore: { nome: 'Mario', cognome: 'Rossi' } }, quantita: 2 },
    ];
    mockUseCart.itemCount = 2;
    mockUseCart.total = 20;

    render(<CartDrawer isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('€10.00')).toBeInTheDocument();
  });

  it('è nascosto quando isOpen è false', () => {
    render(<CartDrawer isOpen={false} onClose={mockOnClose} />);
    const drawer = screen.getByText('Carrello').closest('div[class*="translate"]');
    expect(drawer).toHaveClass('translate-x-full');
  });

  it('chiama onClose quando si clicca la X', () => {
    render(<CartDrawer isOpen={true} onClose={mockOnClose} />);
    const closeBtn = screen.getByRole('button', { name: '' }); // XMarkIcon button
    // Il primo bottone nella header è il close
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]); // primo button è la X
    expect(mockOnClose).toHaveBeenCalled();
  });

  afterEach(() => {
    mockUseCart.items = [];
    mockUseCart.itemCount = 0;
    mockUseCart.total = 0;
  });
});
