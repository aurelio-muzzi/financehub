import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { accountSchema, type AccountSchemaType } from '../schemas/account.schema';
import type { Account, AccountType } from '../types/account.types';

export interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AccountSchemaType) => Promise<void>;
  accountToEdit?: Account | null;
}

const PRESET_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#64748b', // Slate
];

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: 'BANK', label: 'Conta Corrente / Bancária' },
  { value: 'DIGITAL_WALLET', label: 'Carteira Digital / Fintech' },
  { value: 'CASH', label: 'Dinheiro Físico / Espécie' },
  { value: 'INVESTMENT', label: 'Investimentos / Corretora' },
  { value: 'CREDIT_CARD', label: 'Cartão de Crédito' },
  { value: 'OTHER', label: 'Outro' },
];

export const AccountFormModal: React.FC<AccountFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  accountToEdit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AccountSchemaType>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      type: 'BANK',
      initial_balance: 0,
      color: PRESET_COLORS[0],
      icon: 'Landmark',
      is_active: true,
    },
  });

  const selectedColor = useWatch({ control, name: 'color' });

  useEffect(() => {
    if (accountToEdit) {
      reset({
        name: accountToEdit.name,
        type: accountToEdit.type,
        initial_balance: parseFloat(accountToEdit.initial_balance) || 0,
        color: accountToEdit.color || PRESET_COLORS[0],
        icon: accountToEdit.icon || 'Landmark',
        is_active: accountToEdit.is_active,
      });
    } else {
      reset({
        name: '',
        type: 'BANK',
        initial_balance: 0,
        color: PRESET_COLORS[0],
        icon: 'Landmark',
        is_active: true,
      });
    }
  }, [accountToEdit, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: AccountSchemaType) => {
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
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
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
          maxWidth: '480px',
          padding: 'var(--spacing-lg)',
          animation: 'fadeIn 150ms ease-out',
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
            {accountToEdit ? 'Editar Conta Financeira' : 'Nova Conta Financeira'}
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

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}
        >
          <Input
            label="Nome da Conta"
            placeholder="Ex: Nubank, Itaú, Carteira, XP Investimentos..."
            error={errors.name?.message}
            {...register('name')}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <label
              htmlFor="account-type-select"
              style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}
            >
              Tipo de Conta
            </label>
            <select
              id="account-type-select"
              {...register('type')}
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
              {ACCOUNT_TYPES.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.type.message}</span>
            )}
          </div>

          {!accountToEdit && (
            <Input
              label="Saldo Inicial (R$)"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.initial_balance?.message}
              {...register('initial_balance', { valueAsNumber: true })}
            />
          )}

          {/* Seletor de Cores */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
              Cor Identificadora
            </span>
            <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    border:
                      selectedColor === color
                        ? '3px solid var(--text-main)'
                        : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'transform var(--transition-fast)',
                    transform: selectedColor === color ? 'scale(1.15)' : 'none',
                  }}
                  aria-label={`Selecionar cor ${color}`}
                />
              ))}
            </div>
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            <input type="checkbox" {...register('is_active')} />
            <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>Conta Ativa</span>
          </label>

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
              {accountToEdit ? 'Salvar Alterações' : 'Criar Conta'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
