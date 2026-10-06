import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReportsPage } from '@/features/reports/pages/ReportsPage';
import * as useReportsModule from '@/features/reports/hooks/useReports';

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('ReportsPage Component', () => {
  it('renders report header, summary cards, and category breakdowns', () => {
    vi.spyOn(useReportsModule, 'useReports').mockReturnValue({
      report: {
        period: {
          start_date: '2026-10-01',
          end_date: '2026-10-31',
        },
        summary: {
          total_income: '8000.00',
          total_expense: '2500.00',
          net_balance: '5500.00',
          total_count: 12,
        },
        incomes_by_category: [
          {
            category_id: 1,
            name: 'Salário Tech',
            color: '#10b981',
            amount: 8000.0,
            count: 1,
            percentage: 100.0,
          },
        ],
        expenses_by_category: [
          {
            category_id: 2,
            name: 'Supermercado',
            color: '#ef4444',
            amount: 1500.0,
            count: 4,
            percentage: 60.0,
          },
          {
            category_id: 3,
            name: 'Transporte',
            color: '#f59e0b',
            amount: 1000.0,
            count: 2,
            percentage: 40.0,
          },
        ],
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      exportCsv: vi.fn(),
      exportPdf: vi.fn(),
      isExportingCsv: false,
      isExportingPdf: false,
    });

    renderWithProviders(<ReportsPage />);

    expect(screen.getByRole('heading', { name: /relatórios e análises/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /exportar csv/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /exportar pdf/i })).toBeInTheDocument();
    expect(screen.getByText('Total de Receitas')).toBeInTheDocument();
    expect(screen.getByText('Total de Despesas')).toBeInTheDocument();
    expect(screen.getByText('Supermercado')).toBeInTheDocument();
    expect(screen.getByText('Transporte')).toBeInTheDocument();
  });
});
