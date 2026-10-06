import { describe, it, expect } from 'vitest';
import { accountSchema } from '@/features/accounts/schemas/account.schema';

describe('Account Validation Schema', () => {
  it('validates a correct bank account payload', () => {
    const result = accountSchema.safeParse({
      name: 'Nubank Conta Corrente',
      type: 'BANK',
      initial_balance: 1500.5,
      color: '#8b5cf6',
      icon: 'Landmark',
      is_active: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty account name', () => {
    const result = accountSchema.safeParse({
      name: '',
      type: 'BANK',
      initial_balance: 0,
      is_active: true,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid account types', () => {
    const result = accountSchema.safeParse({
      name: 'Minha Conta',
      type: 'CRYPTO_UNKNOWN',
      initial_balance: 0,
      is_active: true,
    } as unknown);
    expect(result.success).toBe(false);
  });

  it('accepts negative initial balance (e.g. credit card overdraft)', () => {
    const result = accountSchema.safeParse({
      name: 'Cartão Santander',
      type: 'CREDIT_CARD',
      initial_balance: -250.0,
      is_active: true,
    });
    expect(result.success).toBe(true);
  });
});
