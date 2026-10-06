import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'O nome é obrigatório').max(100, 'Máximo de 100 caracteres'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    errorMap: () => ({ message: 'Selecione se é Receita ou Despesa' }),
  }),
  color: z.string().max(30).optional(),
  icon: z.string().max(50).optional(),
  is_active: z.boolean(),
});

export type CategorySchemaType = z.infer<typeof categorySchema>;
