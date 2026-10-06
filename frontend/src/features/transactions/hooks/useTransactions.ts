import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsService } from '../services/transactions.service';
import type {
  TransactionFilters,
  CreateTransactionPayload,
  UpdateTransactionPayload,
} from '../types/transaction.types';

export function useTransactions(filters?: TransactionFilters) {
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionsService.getTransactions(filters),
  });

  const summaryQuery = useQuery({
    queryKey: [
      'transactions-summary',
      filters?.account_id,
      filters?.category_id,
      filters?.start_date,
      filters?.end_date,
    ],
    queryFn: () =>
      transactionsService.getTransactionSummary({
        account_id: filters?.account_id,
        category_id: filters?.category_id,
        start_date: filters?.start_date,
        end_date: filters?.end_date,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      transactionsService.createTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-summary'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTransactionPayload }) =>
      transactionsService.updateTransaction(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-summary'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => transactionsService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-summary'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  return {
    transactions: transactionsQuery.data?.data ?? [],
    pagination: transactionsQuery.data?.meta,
    summary: summaryQuery.data,
    isLoading: transactionsQuery.isLoading || summaryQuery.isLoading,
    isError: transactionsQuery.isError || summaryQuery.isError,
    refetch: () => {
      transactionsQuery.refetch();
      summaryQuery.refetch();
    },
    createTransaction: createMutation.mutateAsync,
    updateTransaction: updateMutation.mutateAsync,
    deleteTransaction: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
