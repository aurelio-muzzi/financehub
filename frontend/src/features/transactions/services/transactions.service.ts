import { apiClient } from '@/lib/api/client';
import type {
  Transaction,
  TransactionSummary,
  TransactionFilters,
  CreateTransactionPayload,
  UpdateTransactionPayload,
} from '../types/transaction.types';

export const transactionsService = {
  async getTransactions(filters?: TransactionFilters): Promise<{
    data: Transaction[];
    meta?: { current_page: number; last_page: number; total: number };
  }> {
    const params = new URLSearchParams();

    if (filters?.account_id) params.append('account_id', filters.account_id.toString());
    if (filters?.category_id) params.append('category_id', filters.category_id.toString());
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());

    const response = await apiClient.get<{
      data: Transaction[];
      meta?: { current_page: number; last_page: number; total: number };
    }>(`/v1/transactions?${params.toString()}`);
    return response.data;
  },

  async getTransactionSummary(
    filters?: Pick<TransactionFilters, 'account_id' | 'category_id' | 'start_date' | 'end_date'>
  ): Promise<TransactionSummary> {
    const params = new URLSearchParams();

    if (filters?.account_id) params.append('account_id', filters.account_id.toString());
    if (filters?.category_id) params.append('category_id', filters.category_id.toString());
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const response = await apiClient.get<{ data: TransactionSummary }>(
      `/v1/transactions/summary?${params.toString()}`
    );
    return response.data.data;
  },

  async getTransactionById(id: number): Promise<Transaction> {
    const response = await apiClient.get<{ data: Transaction }>(`/v1/transactions/${id}`);
    return response.data.data;
  },

  async createTransaction(payload: CreateTransactionPayload): Promise<Transaction> {
    const response = await apiClient.post<{ data: Transaction }>('/v1/transactions', payload);
    return response.data.data;
  },

  async updateTransaction(id: number, payload: UpdateTransactionPayload): Promise<Transaction> {
    const response = await apiClient.put<{ data: Transaction }>(`/v1/transactions/${id}`, payload);
    return response.data.data;
  },

  async deleteTransaction(id: number): Promise<void> {
    await apiClient.delete(`/v1/transactions/${id}`);
  },
};
