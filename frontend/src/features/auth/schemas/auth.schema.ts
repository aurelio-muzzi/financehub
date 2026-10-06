import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório').email('Informe um e-mail válido'),
  password: z.string().min(1, 'A senha é obrigatória'),
  remember: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório').email('Informe um e-mail válido'),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token é obrigatório'),
    email: z.string().min(1, 'O e-mail é obrigatório').email('Informe um e-mail válido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    password_confirmation: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine(data => data.password === data.password_confirmation, {
    message: 'As senhas não coincidem',
    path: ['password_confirmation'],
  });

export const updatePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'A senha atual é obrigatória'),
    password: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres'),
    password_confirmation: z.string().min(1, 'Confirmação da nova senha é obrigatória'),
  })
  .refine(data => data.password === data.password_confirmation, {
    message: 'As senhas não coincidem',
    path: ['password_confirmation'],
  });

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordSchemaType = z.infer<typeof updatePasswordSchema>;
