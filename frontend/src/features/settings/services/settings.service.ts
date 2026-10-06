import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/user';
import type { ProfileUpdatePayload, PreferencesPayload } from '../types/settings.types';

export const settingsService = {
  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/api/v1/profile');
    return response.data.data;
  },

  async updateProfile(payload: ProfileUpdatePayload): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>('/api/v1/profile', payload);
    return response.data.data;
  },

  async updatePreferences(payload: PreferencesPayload): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>('/api/v1/profile/preferences', payload);
    return response.data.data;
  },
};
