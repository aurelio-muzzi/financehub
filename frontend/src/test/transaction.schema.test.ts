import { describe, it, expect } from 'vitest';
import { transactionSchema } from '@/features/transactions/schemas/transaction.schema';

describe('Transaction Validation Schema', () => {
  it('validates a correct income transaction', () => {
    const result = transactionSchema.safeParse({
      type: 'INCOME',
      account_id: 1,
      category_id: 2,
      amount: 1500.0,
      date: '2026-10-05',
      description: 'Salário Tech',
      status: 'COMPLETED',
      is_recurring: false,
    });
    expect(result.success).toBe(true);
  });

  it('validates a correct transfer between two different accounts', () => {
    const result = transactionSchema.safeParse({
      type: 'TRANSFER',
      account_id: 1,
      destination_account_id: 2,
      amount: 300.0,
      date: '2026-10-05',
      description: 'Transferência para Poupança',
      status: 'COMPLETED',
      is_recurring: false,
    });
    expect(result.success).toBe(true);
  });

  it('rejects transfer with identical source and destination account', () => {
    const result = transactionSchema.safeParse({
      type: 'TRANSFER',
      account_id: 1,
      destination_account_id: 1,
      amount: 200.0,
      date: '2026-10-05',
      description: 'Transferência mesma conta',
      status: 'COMPLETED',
      is_recurring: false,
    });
    expect(result.success).toBe(false);
  });

  it('rejects zero or negative amount', () => {
    const zeroResult = transactionSchema.safeParse({
      type: 'EXPENSE',
      account_id: 1,
      amount: 0,
      date: '2026-10-05',
      description: 'Café',
      status: 'COMPLETED',
      is_recurring: false,
    });
    expect(zeroResult.success).toBe(false);

    const negativeResult = transactionSchema.safeParse({
      type: 'EXPENSE',
      account_id: 1,
      amount: -50,
      date: '2026-10-05',
      description: 'Café',
      status: 'COMPLETED',
      is_recurring: false,
    });
    expect(negativeResult.success).toBe(false);
  });
});
