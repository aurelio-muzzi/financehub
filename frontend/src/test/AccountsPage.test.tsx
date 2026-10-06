import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AccountsPage } from '@/features/accounts/pages/AccountsPage';
import * as useAccountsModule from '@/features/accounts/hooks/useAccounts';

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('AccountsPage Component', () => {
  it('renders page header and account cards', () => {
    vi.spyOn(useAccountsModule, 'useAccounts').mockReturnValue({
      accounts: [
        {
          id: 1,
          user_id: 1,
          name: 'Nubank Principal',
          type: 'BANK',
          initial_balance: '1000.00',
          current_balance: '1500.50',
          color: '#8b5cf6',
          icon: 'Landmark',
          is_active: true,
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
      ],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      createAccount: vi.fn(),
      updateAccount: vi.fn(),
      deleteAccount: vi.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    } as unknown as ReturnType<typeof useAccountsModule.useAccounts>);

    renderWithProviders(<AccountsPage />);

    expect(screen.getByRole('heading', { name: /contas e carteiras/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nova conta/i })).toBeInTheDocument();
    expect(screen.getByText('Nubank Principal')).toBeInTheDocument();
    expect(screen.getAllByText('Conta Bancária').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/1 Contas Ativas/i)).toBeInTheDocument();
  });

  it('opens account creation modal when clicking nova conta', async () => {
    vi.spyOn(useAccountsModule, 'useAccounts').mockReturnValue({
      accounts: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      createAccount: vi.fn(),
      updateAccount: vi.fn(),
      deleteAccount: vi.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    } as unknown as ReturnType<typeof useAccountsModule.useAccounts>);

    renderWithProviders(<AccountsPage />);

    const newBtn = screen.getByRole('button', { name: /nova conta/i });
    await userEvent.click(newBtn);

    expect(screen.getByRole('heading', { name: /nova conta financeira/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome da conta/i)).toBeInTheDocument();
  });
});
