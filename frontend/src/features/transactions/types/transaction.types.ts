import type { Account } from '@/features/accounts/types/account.types';
import type { Category } from '@/features/categories/types/category.types';

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'CANCELLED';

export type PaymentMethod =
  'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BOLETO' | 'CASH' | 'TRANSFER' | 'OTHER';

export interface Transaction {
  id: number;
  user_id: number;
  account_id: number;
  account?: Account;
  category_id: number | null;
  category?: Category | null;
  destination_account_id: number | null;
  destination_account?: Account | null;
  type: TransactionType;
  amount: string;
  date: string;
  description: string;
  notes: string | null;
  payment_method: PaymentMethod | null;
  status: TransactionStatus;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

export interface TransactionSummary {
  total_income: string;
  total_expense: string;
  net_balance: string;
  count: number;
}

export interface TransactionFilters {
  account_id?: number;
  category_id?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  start_date?: string;
  end_date?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface CreateTransactionPayload {
  account_id: number;
  category_id?: number | null;
  destination_account_id?: number | null;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  notes?: string | null;
  payment_method?: PaymentMethod | null;
  status?: TransactionStatus;
  is_recurring?: boolean;
}

export interface UpdateTransactionPayload {
  account_id?: number;
  category_id?: number | null;
  destination_account_id?: number | null;
  type?: TransactionType;
  amount?: number;
  date?: string;
  description?: string;
  notes?: string | null;
  payment_method?: PaymentMethod | null;
  status?: TransactionStatus;
  is_recurring?: boolean;
}
