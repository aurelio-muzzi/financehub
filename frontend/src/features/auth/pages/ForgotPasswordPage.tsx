import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card/Card';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { authService } from '../services/auth.service';
import { forgotPasswordSchema, type ForgotPasswordSchemaType } from '../schemas/auth.schema';
import { handleAxiosError } from '@/lib/api/errors';

export const ForgotPasswordPage: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    setServerError(null);
    setSuccessMessage(null);
    try {
      const msg = await authService.forgotPassword(data);
      setSuccessMessage(msg);
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
            Recuperar Senha
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Informe seu e-mail cadastrado para receber instruções de recuperação
          </p>
        </div>

        {successMessage && (
          <div
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'var(--income-bg)',
              border: '1px solid var(--income-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--income-text)',
              fontSize: '0.875rem',
            }}
          >
            {successMessage}
          </div>
        )}

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

        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Enviar Link de Recuperação
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
