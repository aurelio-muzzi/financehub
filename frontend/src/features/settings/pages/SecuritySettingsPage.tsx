import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/Card/Card';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { authService } from '@/features/auth/services/auth.service';
import {
  updatePasswordSchema,
  type UpdatePasswordSchemaType,
} from '@/features/auth/schemas/auth.schema';
import { handleAxiosError } from '@/lib/api/errors';

export const SecuritySettingsPage: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordSchemaType>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (data: UpdatePasswordSchemaType) => {
    setServerError(null);
    setSuccessMessage(null);
    try {
      const msg = await authService.updatePassword(data);
      setSuccessMessage(msg);
      reset();
    } catch (err) {
      const appErr = handleAxiosError(err);
      setServerError(appErr.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: '640px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)',
      }}
    >
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Configurações de Segurança
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Gerencie sua senha de acesso e proteção da conta
        </p>
      </div>

      <Card
        title="Alterar Senha"
        subtitle="Informe sua senha atual e digite a nova credencial desejada"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
            marginTop: 'var(--spacing-md)',
          }}
        >
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
            label="Senha Atual"
            type="password"
            placeholder="••••••••"
            error={errors.current_password?.message}
            {...register('current_password')}
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

          <div
            style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-xs)' }}
          >
            <Button type="submit" isLoading={isSubmitting}>
              Atualizar Senha
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
