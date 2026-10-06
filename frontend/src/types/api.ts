export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ApiPaginatedResponse<T> {
  success: boolean;
  data: T[];
  message?: string | null;
  meta: PaginationMeta;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
