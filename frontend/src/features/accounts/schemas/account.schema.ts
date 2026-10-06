import { z } from 'zod';

export const accountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'O nome da conta é obrigatório')
    .max(100, 'Máximo de 100 caracteres'),
  type: z.enum(['BANK', 'CASH', 'DIGITAL_WALLET', 'CREDIT_CARD', 'INVESTMENT', 'OTHER'], {
    errorMap: () => ({ message: 'Selecione um tipo de conta válido' }),
  }),
  initial_balance: z.number(),
  color: z.string().max(30).optional(),
  icon: z.string().max(50).optional(),
  is_active: z.boolean(),
});

export type AccountSchemaType = z.infer<typeof accountSchema>;
