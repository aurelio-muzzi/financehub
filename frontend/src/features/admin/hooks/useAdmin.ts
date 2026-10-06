import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/admin.service';
import type {
  AdminUsersFilter,
  AdminAuditLogsFilter,
  AdminUpdateUserPayload,
} from '../types/admin.types';

export const ADMIN_USERS_KEY = ['admin', 'users'] as const;
export const ADMIN_ROLES_KEY = ['admin', 'roles'] as const;
export const ADMIN_AUDIT_KEY = ['admin', 'audit-logs'] as const;

export function useAdminUsers(params?: AdminUsersFilter) {
  return useQuery({
    queryKey: [...ADMIN_USERS_KEY, params],
    queryFn: () => adminService.getUsers(params),
  });
}

export function useAdminRoles() {
  return useQuery({
    queryKey: ADMIN_ROLES_KEY,
    queryFn: () => adminService.getRoles(),
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminUpdateUserPayload }) =>
      adminService.updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_AUDIT_KEY });
    },
  });
}

export function useAdminAuditLogs(params?: AdminAuditLogsFilter) {
  return useQuery({
    queryKey: [...ADMIN_AUDIT_KEY, params],
    queryFn: () => adminService.getAuditLogs(params),
  });
}
