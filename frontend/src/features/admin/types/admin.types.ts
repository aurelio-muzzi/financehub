export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role_id: number;
  role: {
    id: number;
    name: string;
    label: string;
  } | null;
  status: 'ACTIVE' | 'INACTIVE';
  preferences?: Record<string, unknown> | null;
  accounts_count: number;
  transactions_count: number;
  created_at: string;
  updated_at?: string;
}

export interface RoleItem {
  id: number;
  name: string;
  label: string;
  permissions?: Array<{
    id: number;
    name: string;
    label: string;
  }>;
}

export interface AuditLogItem {
  id: number;
  action: string;
  entity_type: string;
  entity_id: number | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
}

export interface AdminUsersFilter {
  search?: string;
  role_id?: string | number;
  status?: string;
  page?: number;
}

export interface AdminAuditLogsFilter {
  search?: string;
  action?: string;
  entity_type?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
}

export interface AdminUpdateUserPayload {
  role_id: number;
  status: 'ACTIVE' | 'INACTIVE';
}
