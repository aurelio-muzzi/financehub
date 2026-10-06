import { z } from 'zod';

export const transactionSchema = z
  .object({
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER'], {
      errorMap: () => ({ message: 'Tipo de transação inválido' }),
    }),
    account_id: z.number().int().positive('Selecione a conta'),
    category_id: z.number().int().positive().nullable().optional(),
    destination_account_id: z.number().int().positive().nullable().optional(),
    amount: z.number().positive('O valor deve ser maior que zero'),
    date: z.string().min(1, 'A data é obrigatória'),
    description: z
      .string()
      .trim()
      .min(1, 'A descrição é obrigatória')
      .max(255, 'Máximo de 255 caracteres'),
    notes: z.string().max(1000, 'Máximo de 1000 caracteres').optional(),
    payment_method: z
      .enum(['PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'BOLETO', 'CASH', 'TRANSFER', 'OTHER'])
      .optional(),
    status: z.enum(['COMPLETED', 'PENDING', 'CANCELLED'], {
      errorMap: () => ({ message: 'Status inválido' }),
    }),
    is_recurring: z.boolean(),
  })
  .refine(
    data => {
      if (data.type === 'TRANSFER') {
        return !!data.destination_account_id;
      }
      return true;
    },
    {
      message: 'Selecione a conta de destino para a transferência',
      path: ['destination_account_id'],
    }
  )
  .refine(
    data => {
      if (data.type === 'TRANSFER' && data.destination_account_id) {
        return data.destination_account_id !== data.account_id;
      }
      return true;
    },
    {
      message: 'A conta de destino deve ser diferente da conta de origem',
      path: ['destination_account_id'],
    }
  );

export type TransactionSchemaType = z.infer<typeof transactionSchema>;
