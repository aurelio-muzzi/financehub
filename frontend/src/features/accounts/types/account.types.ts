export type AccountType =
  'BANK' | 'CASH' | 'DIGITAL_WALLET' | 'CREDIT_CARD' | 'INVESTMENT' | 'OTHER';

export interface Account {
  id: number;
  user_id: number;
  name: string;
  type: AccountType;
  initial_balance: string;
  current_balance: string;
  color: string | null;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccountFilters {
  type?: AccountType;
  is_active?: boolean;
  search?: string;
}

export interface CreateAccountPayload {
  name: string;
  type: AccountType;
  initial_balance?: number;
  color?: string;
  icon?: string;
  is_active?: boolean;
}

export interface UpdateAccountPayload {
  name?: string;
  type?: AccountType;
  color?: string;
  icon?: string;
  is_active?: boolean;
}
