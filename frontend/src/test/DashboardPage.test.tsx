import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import * as useDashboardModule from '@/features/dashboard/hooks/useDashboard';
import * as useAuthModule from '@/features/auth/hooks/useAuth';
import * as useAccountsModule from '@/features/accounts/hooks/useAccounts';
import * as useTransactionsModule from '@/features/transactions/hooks/useTransactions';

// Mock do ResizeObserver para Recharts no JSDOM
window.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
}

describe('DashboardPage Component', () => {
  it('renders greetings, KPI cards, charts and recent transactions', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: {
        id: 1,
        name: 'Aureliano Muzzi',
        email: 'demo@financehub.test',
        role_id: 1,
        role: { id: 1, name: 'user', label: 'Usuário' },
        status: 'ACTIVE',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
      isAuthenticated: true,
      isAdmin: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      refetchUser: vi.fn(),
    });

    vi.spyOn(useAccountsModule, 'useAccounts').mockReturnValue({
      accounts: [
        {
          id: 1,
          user_id: 1,
          name: 'Nubank',
          type: 'BANK',
          initial_balance: '1000.00',
          current_balance: '2500.00',
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

    vi.spyOn(useDashboardModule, 'useDashboard').mockReturnValue({
      metrics: {
        total_balance: '2500.00',
        monthly_income: '7500.00',
        monthly_expense: '2200.00',
        monthly_net: '5300.00',
        savings_rate: 70.7,
        prev_income: '5000.00',
        prev_expense: '2000.00',
        income_change_percent: 50.0,
        expense_change_percent: 10.0,
      },
      cashFlow: [
        { period: 'Jan/26', year_month: '2026-01', income: 5000, expense: 2000, net: 3000 },
        { period: 'Fev/26', year_month: '2026-02', income: 7500, expense: 2200, net: 5300 },
      ],
      expensesByCategory: [
        { category_id: 1, name: 'Moradia', color: '#3b82f6', amount: 2200, percentage: 100 },
      ],
      recentTransactions: [
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
            current_balance: '2500.00',
            color: '#8b5cf6',
            icon: 'Landmark',
            is_active: true,
            created_at: '2026-01-01T00:00:00Z',
            updated_at: '2026-01-01T00:00:00Z',
          },
          category_id: 1,
          category: null,
          destination_account_id: null,
          destination_account: null,
          type: 'INCOME',
          amount: '7500.00',
          date: '2026-10-05',
          description: 'Salário Tech',
          notes: null,
          payment_method: 'TRANSFER',
          status: 'COMPLETED',
          is_recurring: false,
          created_at: '2026-10-05T00:00:00Z',
          updated_at: '2026-10-05T00:00:00Z',
        },
      ],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderWithProviders(<DashboardPage />);

    expect(screen.getByText(/olá, aureliano muzzi!/i)).toBeInTheDocument();
    expect(screen.getByText('Saldo Consolidado')).toBeInTheDocument();
    expect(screen.getByText('Receitas do Mês')).toBeInTheDocument();
    expect(screen.getByText('Despesas do Mês')).toBeInTheDocument();
    expect(screen.getByText('Resultado Líquido')).toBeInTheDocument();
    expect(screen.getByText('Salário Tech')).toBeInTheDocument();
  });
});
