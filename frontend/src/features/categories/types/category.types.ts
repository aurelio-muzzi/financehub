export type CategoryType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: number;
  user_id: number | null;
  is_system: boolean;
  name: string;
  type: CategoryType;
  color: string | null;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryFilters {
  type?: CategoryType;
  is_active?: boolean;
  search?: string;
}

export interface CreateCategoryPayload {
  name: string;
  type: CategoryType;
  color?: string;
  icon?: string;
  is_active?: boolean;
}

export interface UpdateCategoryPayload {
  name?: string;
  type?: CategoryType;
  color?: string;
  icon?: string;
  is_active?: boolean;
}
