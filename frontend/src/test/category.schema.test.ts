import { describe, it, expect } from 'vitest';
import { categorySchema } from '@/features/categories/schemas/category.schema';

describe('Category Validation Schema', () => {
  it('validates a correct category payload', () => {
    const result = categorySchema.safeParse({
      name: 'Alimentação',
      type: 'EXPENSE',
      color: '#ef4444',
      icon: 'Utensils',
      is_active: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty or whitespace-only name', () => {
    const result = categorySchema.safeParse({
      name: '   ',
      type: 'EXPENSE',
      is_active: true,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid category types', () => {
    const result = categorySchema.safeParse({
      name: 'Salário',
      type: 'INVALID_TYPE',
      is_active: true,
    } as unknown);
    expect(result.success).toBe(false);
  });

  it('accepts INCOME category type', () => {
    const result = categorySchema.safeParse({
      name: 'Salário',
      type: 'INCOME',
      is_active: true,
    });
    expect(result.success).toBe(true);
  });
});
