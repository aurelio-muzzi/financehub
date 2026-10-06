import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { AuthProvider } from '@/features/auth/context/AuthProvider';

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>{ui}</BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

describe('LoginPage Component', () => {
  it('renders login form with all inputs and buttons', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByRole('heading', { name: /acessar conta/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar na plataforma/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /esqueceu a senha\?/i })).toBeInTheDocument();
  });

  it('allows filling demo credentials with quick buttons', async () => {
    renderWithProviders(<LoginPage />);

    const demoButton = screen.getByRole('button', { name: /preencher demo/i });
    await userEvent.click(demoButton);

    const emailInput = screen.getByLabelText(/e-mail/i) as HTMLInputElement;
    expect(emailInput.value).toBe('demo@financehub.test');
  });
});
