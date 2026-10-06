export interface DashboardMetrics {
  total_balance: string;
  monthly_income: string;
  monthly_expense: string;
  monthly_net: string;
  savings_rate: number;
  prev_income: string;
  prev_expense: string;
  income_change_percent: number;
  expense_change_percent: number;
}

export interface CashFlowItem {
  period: string;
  year_month: string;
  income: number;
  expense: number;
  net: number;
}

export interface CategoryExpenseItem {
  category_id: number | null;
  name: string;
  color: string;
  amount: number;
  percentage: number;
}
