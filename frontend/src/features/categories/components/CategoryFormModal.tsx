import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { categorySchema, type CategorySchemaType } from '../schemas/category.schema';
import type { Category } from '../types/category.types';

export interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategorySchemaType) => Promise<void>;
  categoryToEdit?: Category | null;
  defaultType?: 'INCOME' | 'EXPENSE';
}

const PRESET_COLORS = [
  '#10b981', // Emerald
  '#059669', // Dark Emerald
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Amber
  '#64748b', // Slate
];

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categoryToEdit,
  defaultType = 'EXPENSE',
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategorySchemaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: defaultType,
      color: PRESET_COLORS[0],
      icon: 'Tag',
      is_active: true,
    },
  });

  const selectedColor = useWatch({ control, name: 'color' });
  const selectedType = useWatch({ control, name: 'type' });

  useEffect(() => {
    if (categoryToEdit) {
      reset({
        name: categoryToEdit.name,
        type: categoryToEdit.type,
        color: categoryToEdit.color || PRESET_COLORS[0],
        icon: categoryToEdit.icon || 'Tag',
        is_active: categoryToEdit.is_active,
      });
    } else {
      reset({
        name: '',
        type: defaultType,
        color: PRESET_COLORS[0],
        icon: 'Tag',
        is_active: true,
      });
    }
  }, [categoryToEdit, defaultType, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: CategorySchemaType) => {
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
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
        }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          width: '100%',
          maxWidth: '460px',
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
            {categoryToEdit ? 'Editar Categoria' : 'Nova Categoria'}
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
          {/* Seletor de Tipo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
              Tipo de Categoria
            </span>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}
            >
              <button
                type="button"
                onClick={() => setValue('type', 'EXPENSE')}
                style={{
                  minHeight: 'var(--min-touch-size)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  border: `2px solid ${selectedType === 'EXPENSE' ? 'var(--expense-text)' : 'var(--border-light)'}`,
                  backgroundColor:
                    selectedType === 'EXPENSE' ? 'var(--expense-bg)' : 'var(--bg-surface)',
                  color: selectedType === 'EXPENSE' ? 'var(--expense-text)' : 'var(--text-muted)',
                }}
              >
                Despesa
              </button>
              <button
                type="button"
                onClick={() => setValue('type', 'INCOME')}
                style={{
                  minHeight: 'var(--min-touch-size)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  border: `2px solid ${selectedType === 'INCOME' ? 'var(--income-text)' : 'var(--border-light)'}`,
                  backgroundColor:
                    selectedType === 'INCOME' ? 'var(--income-bg)' : 'var(--bg-surface)',
                  color: selectedType === 'INCOME' ? 'var(--income-text)' : 'var(--text-muted)',
                }}
              >
                Receita
              </button>
            </div>
          </div>

          <Input
            label="Nome da Categoria"
            placeholder="Ex: Alimentação, Aluguel, Salário..."
            error={errors.name?.message}
            {...register('name')}
          />

          {/* Paleta de Cores */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
              Cor da Categoria
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

          {/* Ativo / Inativo */}
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
            <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>Categoria Ativa</span>
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
              {categoryToEdit ? 'Salvar Alterações' : 'Criar Categoria'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
