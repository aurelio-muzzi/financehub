import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsService } from '../services/accounts.service';
import type {
  AccountFilters,
  CreateAccountPayload,
  UpdateAccountPayload,
} from '../types/account.types';

const EMPTY_ACCOUNTS: never[] = [];

export function useAccounts(filters?: AccountFilters) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['accounts', filters],
    queryFn: () => accountsService.getAccounts(filters),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateAccountPayload) => accountsService.createAccount(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAccountPayload }) =>
      accountsService.updateAccount(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => accountsService.deleteAccount(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  return {
    ...query,
    accounts: query.data ?? EMPTY_ACCOUNTS,
    createAccount: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateAccount: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteAccount: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
