import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { useAccounts } from '@/features/accounts/hooks/useAccounts';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { transactionSchema, type TransactionSchemaType } from '../schemas/transaction.schema';
import type { Transaction, TransactionType, PaymentMethod } from '../types/transaction.types';

export interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionSchemaType) => Promise<void>;
  transactionToEdit?: Transaction | null;
  defaultType?: TransactionType;
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'PIX', label: 'PIX' },
  { value: 'CREDIT_CARD', label: 'Cartão de Crédito' },
  { value: 'DEBIT_CARD', label: 'Cartão de Débito' },
  { value: 'BOLETO', label: 'Boleto Bancário' },
  { value: 'TRANSFER', label: 'Transferência Bancária / TED' },
  { value: 'CASH', label: 'Dinheiro em Espécie' },
  { value: 'OTHER', label: 'Outro' },
];

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  transactionToEdit,
  defaultType = 'EXPENSE',
}) => {
  const { accounts } = useAccounts({ is_active: true });
  const { categories } = useCategories({ is_active: true });

  const todayStr = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionSchemaType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: defaultType,
      account_id: accounts[0]?.id ?? 1,
      category_id: null,
      destination_account_id: null,
      amount: 0,
      date: todayStr,
      description: '',
      notes: '',
      payment_method: 'PIX',
      status: 'COMPLETED',
      is_recurring: false,
    },
  });

  const selectedType = useWatch({ control, name: 'type' });
  const selectedAccountId = useWatch({ control, name: 'account_id' });

  useEffect(() => {
    if (transactionToEdit) {
      reset({
        type: transactionToEdit.type,
        account_id: transactionToEdit.account_id,
        category_id: transactionToEdit.category_id,
        destination_account_id: transactionToEdit.destination_account_id,
        amount: parseFloat(transactionToEdit.amount) || 0,
        date: transactionToEdit.date,
        description: transactionToEdit.description,
        notes: transactionToEdit.notes || '',
        payment_method: transactionToEdit.payment_method || 'PIX',
        status: transactionToEdit.status,
        is_recurring: transactionToEdit.is_recurring,
      });
    } else {
      reset({
        type: defaultType,
        account_id: accounts[0]?.id ?? 1,
        category_id: null,
        destination_account_id: null,
        amount: 0,
        date: todayStr,
        description: '',
        notes: '',
        payment_method: 'PIX',
        status: 'COMPLETED',
        is_recurring: false,
      });
    }
  }, [transactionToEdit, defaultType, accounts, reset, todayStr]);

  if (!isOpen) return null;

  const filteredCategories = categories.filter(c => {
    if (selectedType === 'EXPENSE') return c.type === 'EXPENSE';
    if (selectedType === 'INCOME') return c.type === 'INCOME';
    return false;
  });

  const availableDestinationAccounts = accounts.filter(a => a.id !== selectedAccountId);

  const handleFormSubmit = async (data: TransactionSchemaType) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-md)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        onClick={onClose}
      />

      <div
        style={{
          position: 'relative',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 'var(--spacing-lg)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {transactionToEdit ? 'Editar Movimentação' : 'Nova Movimentação'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              display: 'flex',
            }}
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Seleção do Tipo de Transação */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            backgroundColor: 'var(--bg-muted)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setValue('type', 'EXPENSE');
              setValue('destination_account_id', null);
            }}
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: 600,
              backgroundColor: selectedType === 'EXPENSE' ? 'var(--bg-surface)' : 'transparent',
              color: selectedType === 'EXPENSE' ? 'var(--expense-text)' : 'var(--text-muted)',
              boxShadow: selectedType === 'EXPENSE' ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)',
            }}
          >
            Despesa
          </button>
          <button
            type="button"
            onClick={() => {
              setValue('type', 'INCOME');
              setValue('destination_account_id', null);
            }}
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: 600,
              backgroundColor: selectedType === 'INCOME' ? 'var(--bg-surface)' : 'transparent',
              color: selectedType === 'INCOME' ? 'var(--income-text)' : 'var(--text-muted)',
              boxShadow: selectedType === 'INCOME' ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)',
            }}
          >
            Receita
          </button>
          <button
            type="button"
            onClick={() => {
              setValue('type', 'TRANSFER');
              setValue('category_id', null);
            }}
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: 600,
              backgroundColor: selectedType === 'TRANSFER' ? 'var(--bg-surface)' : 'transparent',
              color: selectedType === 'TRANSFER' ? 'var(--primary-600)' : 'var(--text-muted)',
              boxShadow: selectedType === 'TRANSFER' ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)',
            }}
          >
            Transferência
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}
        >
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}
          >
            <Input
              label="Valor (R$)"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.amount?.message}
              {...register('amount', { valueAsNumber: true })}
            />

            <Input
              label="Data da Operação"
              type="date"
              error={errors.date?.message}
              {...register('date')}
            />
          </div>

          <Input
            label="Descrição"
            placeholder="Ex: Aluguel, Salário, Supermercado..."
            error={errors.description?.message}
            {...register('description')}
          />

          {/* Seleção de Contas */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: selectedType === 'TRANSFER' ? '1fr 1fr' : '1fr',
              gap: 'var(--spacing-md)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              <label
                htmlFor="tx-account"
                style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}
              >
                {selectedType === 'TRANSFER' ? 'Conta de Origem' : 'Conta'}
              </label>
              <select
                id="tx-account"
                {...register('account_id', { valueAsNumber: true })}
                style={{
                  width: '100%',
                  minHeight: 'var(--min-touch-size)',
                  padding: '0 var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  outline: 'none',
                }}
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.type})
                  </option>
                ))}
              </select>
              {errors.account_id && (
                <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>
                  {errors.account_id.message}
                </span>
              )}
            </div>

            {selectedType === 'TRANSFER' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                <label
                  htmlFor="tx-dest-account"
                  style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}
                >
                  Conta de Destino
                </label>
                <select
                  id="tx-dest-account"
                  {...register('destination_account_id', { valueAsNumber: true })}
                  style={{
                    width: '100%',
                    minHeight: 'var(--min-touch-size)',
                    padding: '0 var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-main)',
                    outline: 'none',
                  }}
                >
                  <option value="">Selecione o destino</option>
                  {availableDestinationAccounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.type})
                    </option>
                  ))}
                </select>
                {errors.destination_account_id && (
                  <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>
                    {errors.destination_account_id.message}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Categoria (se não for transferência) */}
          {selectedType !== 'TRANSFER' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              <label
                htmlFor="tx-category"
                style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}
              >
                Categoria
              </label>
              <select
                id="tx-category"
                {...register('category_id', {
                  setValueAs: v => (v === '' || v === null ? null : parseInt(v, 10)),
                })}
                style={{
                  width: '100%',
                  minHeight: 'var(--min-touch-size)',
                  padding: '0 var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  outline: 'none',
                }}
              >
                <option value="">Sem categoria</option>
                {filteredCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>
                  {errors.category_id.message}
                </span>
              )}
            </div>
          )}

          {/* Forma de Pagamento e Status */}
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              <label
                htmlFor="tx-payment"
                style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}
              >
                Forma de Pagamento
              </label>
              <select
                id="tx-payment"
                {...register('payment_method')}
                style={{
                  width: '100%',
                  minHeight: 'var(--min-touch-size)',
                  padding: '0 var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  outline: 'none',
                }}
              >
                {PAYMENT_METHODS.map(m => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              <label
                htmlFor="tx-status"
                style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}
              >
                Status da Transação
              </label>
              <select
                id="tx-status"
                {...register('status')}
                style={{
                  width: '100%',
                  minHeight: 'var(--min-touch-size)',
                  padding: '0 var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  outline: 'none',
                }}
              >
                <option value="COMPLETED">Concluída / Efetivada</option>
                <option value="PENDING">Pendente / Agendada</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <label
              htmlFor="tx-notes"
              style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}
            >
              Observações / Notas
            </label>
            <textarea
              id="tx-notes"
              rows={2}
              placeholder="Anotações opcionais..."
              {...register('notes')}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
                outline: 'none',
                fontSize: '0.875rem',
                resize: 'vertical',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--spacing-sm)',
              marginTop: 'var(--spacing-sm)',
            }}
          >
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {transactionToEdit ? 'Salvar Alterações' : 'Registrar Movimentação'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
