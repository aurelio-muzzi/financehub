export interface AlertItem {
  id: string;
  source: 'transaction' | 'account' | 'system';
  type: 'DANGER' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  date: string;
  is_urgent: boolean;
  transaction_id?: number;
  account_id?: number;
  account_name?: string;
  category_name?: string;
}

export interface NotificationItem {
  id: number;
  source: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'DANGER' | string;
  title: string;
  message: string;
  data?: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
}

export interface NotificationSummary {
  alerts: AlertItem[];
  notifications: NotificationItem[];
  unread_count: number;
}
