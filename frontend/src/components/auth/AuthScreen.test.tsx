import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthScreen from './AuthScreen';
import '@testing-library/jest-dom';

describe('AuthScreen - Validazione Login', () => {
  // Creiamo delle funzioni fittizie (mock)
  const mockLoginSuccess = jest.fn();
  const mockGuestLogin = jest.fn();

  test('il pulsante "Accedi" deve essere disabilitato se i campi sono vuoti', () => {
    render(<AuthScreen onLoginSuccess={jest.fn()} onGuestLogin={jest.fn()} />);

    const submitBtn = screen.getByRole('button', { name: /accedi/i });
    expect(submitBtn).toBeDisabled();
  });

  test('abilita il pulsante quando i dati sono inseriti correttamente', async () => {
    render(<AuthScreen onLoginSuccess={jest.fn()} onGuestLogin={jest.fn()} />);
    const user = userEvent.setup();

    // Cambiato da getByLabelText a getByPlaceholderText
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitBtn = screen.getByRole('button', { name: /accedi/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(submitBtn).toBeEnabled();
  });

  test('abilita il pulsante quando i dati sono inseriti correttamente', async () => {
    render(<AuthScreen onLoginSuccess={mockLoginSuccess} onGuestLogin={mockGuestLogin} />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole('button', { name: /accedi/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'PasswordSicura123');

    expect(submitBtn).toBeEnabled();
  });
});