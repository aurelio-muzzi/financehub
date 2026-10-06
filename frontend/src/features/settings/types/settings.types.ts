export interface ProfileUpdatePayload {
  name: string;
  email: string;
}

export interface PreferencesPayload {
  theme?: 'light' | 'dark' | 'system';
  currency?: 'BRL' | 'USD' | 'EUR';
  date_format?: string;
  timezone?: string;
  notify_overdue?: boolean;
  notify_due_soon?: boolean;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  currency?: 'BRL' | 'USD' | 'EUR';
  date_format?: string;
  timezone?: string;
  notify_overdue?: boolean;
  notify_due_soon?: boolean;
  [key: string]: unknown;
}
