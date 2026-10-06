import { apiClient } from '@/lib/api/client';
import type { ApiResponse, ApiPaginatedResponse } from '@/types/api';
import type {
  AdminUser,
  RoleItem,
  AuditLogItem,
  AdminUsersFilter,
  AdminAuditLogsFilter,
  AdminUpdateUserPayload,
} from '../types/admin.types';

export const adminService = {
  async getUsers(params?: AdminUsersFilter): Promise<ApiPaginatedResponse<AdminUser>> {
    const response = await apiClient.get<ApiPaginatedResponse<AdminUser>>('/api/v1/admin/users', {
      params,
    });
    return response.data;
  },

  async updateUser(id: number, payload: AdminUpdateUserPayload): Promise<AdminUser> {
    const response = await apiClient.put<ApiResponse<AdminUser>>(
      `/api/v1/admin/users/${id}`,
      payload
    );
    return response.data.data;
  },

  async getRoles(): Promise<RoleItem[]> {
    const response = await apiClient.get<ApiResponse<RoleItem[]>>('/api/v1/admin/roles');
    return response.data.data;
  },

  async getAuditLogs(params?: AdminAuditLogsFilter): Promise<ApiPaginatedResponse<AuditLogItem>> {
    const response = await apiClient.get<ApiPaginatedResponse<AuditLogItem>>(
      '/api/v1/admin/audit-logs',
      {
        params,
      }
    );
    return response.data;
  },
};
