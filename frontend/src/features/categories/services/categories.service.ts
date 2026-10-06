import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  Category,
  CategoryFilters,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '../types/category.types';

export const categoriesService = {
  async getCategories(filters?: CategoryFilters): Promise<Category[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.is_active !== undefined) params.append('is_active', String(filters.is_active));
    if (filters?.search) params.append('search', filters.search);

    const response = await apiClient.get<ApiResponse<Category[]>>('/api/v1/categories', { params });
    return response.data.data;
  },

  async getCategory(id: number): Promise<Category> {
    const response = await apiClient.get<ApiResponse<Category>>(`/api/v1/categories/${id}`);
    return response.data.data;
  },

  async createCategory(payload: CreateCategoryPayload): Promise<Category> {
    const response = await apiClient.post<ApiResponse<Category>>('/api/v1/categories', payload);
    return response.data.data;
  },

  async updateCategory(id: number, payload: UpdateCategoryPayload): Promise<Category> {
    const response = await apiClient.patch<ApiResponse<Category>>(
      `/api/v1/categories/${id}`,
      payload
    );
    return response.data.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/categories/${id}`);
  },
};
