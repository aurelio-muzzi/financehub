import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/Card/Card';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { loginSchema, type LoginSchemaType } from '../schemas/auth.schema';
import { handleAxiosError } from '@/lib/api/errors';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setServerError(null);
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      const appErr = handleAxiosError(err);
      setServerError(appErr.message);
    }
  };

  const fillCredentials = (email: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', 'password123', { shouldValidate: true });
  };

  return (
    <Card>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}
      >
        <div style={{ marginBottom: 'var(--spacing-xs)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Acessar Conta
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Insira suas credenciais para gerenciar suas finanças
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

        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.875rem',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              cursor: 'pointer',
            }}
          >
            <input type="checkbox" {...register('remember')} />
            <span style={{ color: 'var(--text-muted)' }}>Lembrar-me</span>
          </label>
          <Link
            to="/forgot-password"
            style={{ color: 'var(--primary-700)', fontWeight: 500, fontSize: '0.8125rem' }}
          >
            Esqueceu a senha?
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Entrar na Plataforma
        </Button>

        {/* Demonstração Portfólio - Acesso Rápido */}
        <div
          style={{
            marginTop: 'var(--spacing-sm)',
            paddingTop: 'var(--spacing-md)',
            borderTop: '1px solid var(--border-light)',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-subtle)',
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
            }}
          >
            Ambiente de Demonstração (Portfólio):
          </span>
          <div style={{ display: 'flex', gap: 'var(--spacing-xs)', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => fillCredentials('demo@financehub.test')}
              style={{
                fontSize: '0.75rem',
                padding: '4px 8px',
                backgroundColor: 'var(--bg-surface-hover)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-main)',
              }}
            >
              Preencher Demo
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin@financehub.test')}
              style={{
                fontSize: '0.75rem',
                padding: '4px 8px',
                backgroundColor: 'var(--bg-surface-hover)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-main)',
              }}
            >
              Preencher Admin
            </button>
          </div>
        </div>
      </form>
    </Card>
  );
};
