import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  Account,
  AccountFilters,
  CreateAccountPayload,
  UpdateAccountPayload,
} from '../types/account.types';

export const accountsService = {
  async getAccounts(filters?: AccountFilters): Promise<Account[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.is_active !== undefined) params.append('is_active', String(filters.is_active));
    if (filters?.search) params.append('search', filters.search);

    const response = await apiClient.get<ApiResponse<Account[]>>('/api/v1/accounts', { params });
    return response.data.data;
  },

  async getAccount(id: number): Promise<Account> {
    const response = await apiClient.get<ApiResponse<Account>>(`/api/v1/accounts/${id}`);
    return response.data.data;
  },

  async createAccount(payload: CreateAccountPayload): Promise<Account> {
    const response = await apiClient.post<ApiResponse<Account>>('/api/v1/accounts', payload);
    return response.data.data;
  },

  async updateAccount(id: number, payload: UpdateAccountPayload): Promise<Account> {
    const response = await apiClient.patch<ApiResponse<Account>>(`/api/v1/accounts/${id}`, payload);
    return response.data.data;
  },

  async deleteAccount(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/accounts/${id}`);
  },

  async getAccountBalance(
    id: number
  ): Promise<{ account_id: number; name: string; current_balance: string }> {
    const response = await apiClient.get<
      ApiResponse<{ account_id: number; name: string; current_balance: string }>
    >(`/api/v1/accounts/${id}/balance`);
    return response.data.data;
  },
};
