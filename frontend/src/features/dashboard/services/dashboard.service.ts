import { apiClient } from '@/lib/api/client';
import type { Transaction } from '@/features/transactions/types/transaction.types';
import type { DashboardMetrics, CashFlowItem, CategoryExpenseItem } from '../types/dashboard.types';

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await apiClient.get<{ data: DashboardMetrics }>('/api/v1/dashboard/metrics');
    return response.data.data;
  },

  async getCashFlow(months: number = 6): Promise<CashFlowItem[]> {
    const response = await apiClient.get<{ data: CashFlowItem[] }>(
      `/api/v1/dashboard/cash-flow?months=${months}`
    );
    return response.data.data;
  },

  async getExpensesByCategory(
    startDate?: string,
    endDate?: string
  ): Promise<CategoryExpenseItem[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await apiClient.get<{ data: CategoryExpenseItem[] }>(
      `/api/v1/dashboard/expenses-by-category?${params.toString()}`
    );
    return response.data.data;
  },

  async getRecentTransactions(limit: number = 5): Promise<Transaction[]> {
    const response = await apiClient.get<{ data: Transaction[] }>(
      `/api/v1/dashboard/recent-transactions?limit=${limit}`
    );
    return response.data.data;
  },
};
