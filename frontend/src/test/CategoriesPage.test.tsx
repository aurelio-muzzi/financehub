import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage';
import * as useCategoriesModule from '@/features/categories/hooks/useCategories';

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('CategoriesPage Component', () => {
  it('renders page header and new category button', () => {
    vi.spyOn(useCategoriesModule, 'useCategories').mockReturnValue({
      categories: [
        {
          id: 1,
          user_id: null,
          name: 'Alimentação',
          type: 'EXPENSE',
          color: '#ef4444',
          icon: 'Utensils',
          is_active: true,
          is_system: true,
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
      ],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      createCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    } as unknown as ReturnType<typeof useCategoriesModule.useCategories>);

    renderWithProviders(<CategoriesPage />);

    expect(screen.getByRole('heading', { name: /categorias financeiras/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nova categoria/i })).toBeInTheDocument();
    expect(screen.getByText('Alimentação')).toBeInTheDocument();
  });

  it('opens category creation modal when clicking nova categoria', async () => {
    vi.spyOn(useCategoriesModule, 'useCategories').mockReturnValue({
      categories: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      createCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    } as unknown as ReturnType<typeof useCategoriesModule.useCategories>);

    renderWithProviders(<CategoriesPage />);

    const newBtn = screen.getByRole('button', { name: /nova categoria/i });
    await userEvent.click(newBtn);

    expect(screen.getByRole('heading', { name: /nova categoria/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome da categoria/i)).toBeInTheDocument();
  });
});
