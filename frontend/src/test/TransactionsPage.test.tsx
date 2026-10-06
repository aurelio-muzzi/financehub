import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TransactionsPage } from '@/features/transactions/pages/TransactionsPage';
import * as useTransactionsModule from '@/features/transactions/hooks/useTransactions';
import * as useAccountsModule from '@/features/accounts/hooks/useAccounts';
import * as useCategoriesModule from '@/features/categories/hooks/useCategories';

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('TransactionsPage Component', () => {
  it('renders page header, financial summary cards and transactions table', () => {
    vi.spyOn(useAccountsModule, 'useAccounts').mockReturnValue({
      accounts: [
        {
          id: 1,
          user_id: 1,
          name: 'Nubank',
          type: 'BANK',
          initial_balance: '1000.00',
          current_balance: '1500.00',
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

    vi.spyOn(useCategoriesModule, 'useCategories').mockReturnValue({
      categories: [
        {
          id: 1,
          user_id: 1,
          name: 'Salário',
          type: 'INCOME',
          color: '#10b981',
          icon: 'DollarSign',
          is_active: true,
          is_system: false,
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
      ],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      createCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    } as unknown as ReturnType<typeof useCategoriesModule.useCategories>);

    vi.spyOn(useTransactionsModule, 'useTransactions').mockReturnValue({
      transactions: [
        {
          id: 1,
          user_id: 1,
          account_id: 1,
          account: {
            id: 1,
            user_id: 1,
            name: 'Nubank',
            type: 'BANK',
            initial_balance: '1000.00',
            current_balance: '1500.00',
            color: '#8b5cf6',
            icon: 'Landmark',
            is_active: true,
            created_at: '2026-01-01T00:00:00Z',
            updated_at: '2026-01-01T00:00:00Z',
          },
          category_id: 1,
          category: {
            id: 1,
            user_id: 1,
            name: 'Salário',
            type: 'INCOME',
            color: '#10b981',
            icon: 'DollarSign',
            is_active: true,
            is_system: false,
            created_at: '2026-01-01T00:00:00Z',
            updated_at: '2026-01-01T00:00:00Z',
          },
          destination_account_id: null,
          destination_account: null,
          type: 'INCOME',
          amount: '5000.00',
          date: '2026-10-05',
          description: 'Salário Mensal Tech Corp',
          notes: null,
          payment_method: 'TRANSFER',
          status: 'COMPLETED',
          is_recurring: false,
          created_at: '2026-10-05T00:00:00Z',
          updated_at: '2026-10-05T00:00:00Z',
        },
      ],
      summary: {
        total_income: '5000.00',
        total_expense: '0.00',
        net_balance: '5000.00',
        count: 1,
      },
      pagination: {
        current_page: 1,
        last_page: 1,
        total: 1,
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      createTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    } as unknown as ReturnType<typeof useTransactionsModule.useTransactions>);

    renderWithProviders(<TransactionsPage />);

    expect(screen.getByRole('heading', { name: /extrato de movimentações/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nova movimentação/i })).toBeInTheDocument();
    expect(screen.getByText('Receitas do Período')).toBeInTheDocument();
    expect(screen.getByText('Despesas do Período')).toBeInTheDocument();
    expect(screen.getByText('Salário Mensal Tech Corp')).toBeInTheDocument();
  });

  it('opens transaction creation modal when clicking nova movimentação', async () => {
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

    vi.spyOn(useCategoriesModule, 'useCategories').mockReturnValue({
      categories: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      createCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    } as unknown as ReturnType<typeof useCategoriesModule.useCategories>);

    vi.spyOn(useTransactionsModule, 'useTransactions').mockReturnValue({
      transactions: [],
      summary: undefined,
      pagination: undefined,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      createTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    } as unknown as ReturnType<typeof useTransactionsModule.useTransactions>);

    renderWithProviders(<TransactionsPage />);

    const newBtn = screen.getAllByRole('button', { name: /nova movimentação/i })[0];
    await userEvent.click(newBtn);

    expect(screen.getByRole('heading', { name: /nova movimentação/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
  });
});
