import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '../services/categories.service';
import type {
  CategoryFilters,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '../types/category.types';

export function useCategories(filters?: CategoryFilters) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['categories', filters],
    queryFn: () => categoriesService.getCategories(filters),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateCategoryPayload) => categoriesService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCategoryPayload }) =>
      categoriesService.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoriesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return {
    ...query,
    categories: query.data ?? [],
    createCategory: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCategory: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteCategory: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
