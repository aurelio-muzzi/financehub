export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface Role {
  id: number;
  name: string;
  label: string;
}

export interface Permission {
  id: number;
  name: string;
  label: string;
}

export interface UserPreferences {
  currency?: 'BRL' | 'USD' | 'EUR';
  date_format?: string;
  timezone?: string;
  theme?: 'light' | 'dark' | 'system';
  notify_overdue?: boolean;
  notify_due_soon?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  role?: Role;
  status: UserStatus;
  preferences?: UserPreferences;
  created_at: string;
  updated_at: string;
}
