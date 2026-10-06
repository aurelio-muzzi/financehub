export interface CategoryReportItem {
  category_id: number | null;
  name: string;
  color: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface AnalyticsReport {
  period: {
    start_date: string;
    end_date: string;
  };
  summary: {
    total_income: string;
    total_expense: string;
    net_balance: string;
    total_count: number;
  };
  incomes_by_category: CategoryReportItem[];
  expenses_by_category: CategoryReportItem[];
}
