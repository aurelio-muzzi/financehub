import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types/api';
import type { NotificationSummary } from '../types/notifications.types';

export const notificationsService = {
  async getSummary(): Promise<NotificationSummary> {
    const response = await apiClient.get<ApiResponse<NotificationSummary>>('/api/v1/notifications');
    return response.data.data;
  },

  async markAsRead(id: number): Promise<void> {
    await apiClient.post(`/api/v1/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.post('/api/v1/notifications/mark-all-read');
  },
};
