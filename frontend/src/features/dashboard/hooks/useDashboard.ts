import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

export function useDashboard(startDate?: string, endDate?: string) {
  const metricsQuery = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => dashboardService.getMetrics(),
  });

  const cashFlowQuery = useQuery({
    queryKey: ['dashboard-cash-flow'],
    queryFn: () => dashboardService.getCashFlow(6),
  });

  const expensesQuery = useQuery({
    queryKey: ['dashboard-expenses-by-category', startDate, endDate],
    queryFn: () => dashboardService.getExpensesByCategory(startDate, endDate),
  });

  const recentTransactionsQuery = useQuery({
    queryKey: ['dashboard-recent-transactions'],
    queryFn: () => dashboardService.getRecentTransactions(5),
  });

  const isLoading =
    metricsQuery.isLoading ||
    cashFlowQuery.isLoading ||
    expensesQuery.isLoading ||
    recentTransactionsQuery.isLoading;

  const isError =
    metricsQuery.isError ||
    cashFlowQuery.isError ||
    expensesQuery.isError ||
    recentTransactionsQuery.isError;

  const refetchAll = () => {
    metricsQuery.refetch();
    cashFlowQuery.refetch();
    expensesQuery.refetch();
    recentTransactionsQuery.refetch();
  };

  return {
    metrics: metricsQuery.data,
    cashFlow: cashFlowQuery.data ?? [],
    expensesByCategory: expensesQuery.data ?? [],
    recentTransactions: recentTransactionsQuery.data ?? [],
    isLoading,
    isError,
    refetch: refetchAll,
  };
}
