import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card/Card';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { authService } from '../services/auth.service';
import { resetPasswordSchema, type ResetPasswordSchemaType } from '../schemas/auth.schema';
import { handleAxiosError } from '@/lib/api/errors';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const tokenParam = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: tokenParam,
      email: emailParam,
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (data: ResetPasswordSchemaType) => {
    setServerError(null);
    try {
      await authService.resetPassword(data);
      navigate('/login', {
        replace: true,
        state: { message: 'Senha redefinida com sucesso. Faça login com sua nova senha.' },
      });
    } catch (err) {
      const appErr = handleAxiosError(err);
      setServerError(appErr.message);
    }
  };

  return (
    <Card>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}
      >
        <div style={{ marginBottom: 'var(--spacing-xs)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Criar Nova Senha
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Defina sua nova credencial de acesso
          </p>
        </div>

        {serverError && (
          <div
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: '#fef2f2',
              border: '1px solid #fee2e2',
              borderRadius: 'var(--radius-md)',
              color: '#dc2626',
              fontSize: '0.875rem',
            }}
          >
            {serverError}
          </div>
        )}

        <input type="hidden" {...register('token')} />

        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Nova Senha"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirmar Nova Senha"
          type="password"
          placeholder="••••••••"
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Redefinir e Salvar Senha
        </Button>

        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xs)' }}>
          <Link
            to="/login"
            style={{ fontSize: '0.875rem', color: 'var(--primary-700)', fontWeight: 500 }}
          >
            ← Voltar para o Login
          </Link>
        </div>
      </form>
    </Card>
  );
};
