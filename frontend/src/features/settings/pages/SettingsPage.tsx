import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User as UserIcon, Shield, Sliders, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { useProfile, useUpdateProfile, useUpdatePreferences } from '../hooks/useSettings';
import { authService } from '@/features/auth/services/auth.service';
import {
  updatePasswordSchema,
  type UpdatePasswordSchemaType,
} from '@/features/auth/schemas/auth.schema';
import { handleAxiosError } from '@/lib/api/errors';
import type { PreferencesPayload } from '../types/settings.types';

const profileSchema = z.object({
  name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Informe um e-mail válido'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface PreferencesTabProps {
  initialPreferences?: PreferencesPayload | null;
  onSave: (prefs: PreferencesPayload) => Promise<void>;
  isSaving: boolean;
}

const PreferencesTab: React.FC<PreferencesTabProps> = ({
  initialPreferences,
  onSave,
  isSaving,
}) => {
  const [preferences, setPreferences] = useState<PreferencesPayload>({
    theme: 'light',
    currency: 'BRL',
    date_format: 'dd/MM/yyyy',
    notify_overdue: true,
    notify_due_soon: true,
    ...(initialPreferences || {}),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void onSave(preferences);
  };

  return (
    <Card
      title="Preferências da Conta"
      subtitle="Personalize sua experiência visual e notificações"
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-lg)',
          marginTop: 'var(--spacing-md)',
        }}
      >
        {/* Moeda Padrão */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Moeda Padrão
          </label>
          <select
            value={preferences.currency || 'BRL'}
            onChange={e =>
              setPreferences(prev => ({
                ...prev,
                currency: e.target.value as 'BRL' | 'USD' | 'EUR',
              }))
            }
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-main)',
              fontSize: '0.875rem',
            }}
          >
            <option value="BRL">Real Brasileiro (R$ - BRL)</option>
            <option value="USD">Dólar Americano ($ - USD)</option>
            <option value="EUR">Euro (€ - EUR)</option>
          </select>
        </div>

        {/* Formato de Data */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Formato de Data
          </label>
          <select
            value={preferences.date_format || 'dd/MM/yyyy'}
            onChange={e =>
              setPreferences(prev => ({
                ...prev,
                date_format: e.target.value,
              }))
            }
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-main)',
              fontSize: '0.875rem',
            }}
          >
            <option value="dd/MM/yyyy">DD/MM/AAAA (ex: 31/12/2026)</option>
            <option value="yyyy-MM-dd">AAAA-MM-DD (ex: 2026-12-31)</option>
            <option value="MM/dd/yyyy">MM/DD/AAAA (ex: 12/31/2026)</option>
          </select>
        </div>

        {/* Notificações Inteligentes */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-sm)',
            paddingTop: 'var(--spacing-xs)',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Alertas Financeiros no Painel
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.875rem',
              color: 'var(--text-main)',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={preferences.notify_overdue ?? true}
              onChange={e =>
                setPreferences(prev => ({
                  ...prev,
                  notify_overdue: e.target.checked,
                }))
              }
              style={{ width: '16px', height: '16px' }}
            />
            <span>Exibir alerta para contas atrasadas (vencidas e não pagas)</span>
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.875rem',
              color: 'var(--text-main)',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={preferences.notify_due_soon ?? true}
              onChange={e =>
                setPreferences(prev => ({
                  ...prev,
                  notify_due_soon: e.target.checked,
                }))
              }
              style={{ width: '16px', height: '16px' }}
            />
            <span>Exibir alerta para vencimentos nos próximos 7 dias</span>
          </label>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 'var(--spacing-xs)',
          }}
        >
          <Button type="submit" isLoading={isSaving}>
            Salvar Preferências
          </Button>
        </div>
      </form>
    </Card>
  );
};

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const { data: user, isLoading: isLoadingProfile } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const updatePreferencesMutation = useUpdatePreferences();

  // Formulário de Perfil
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, resetProfile]);

  // Formulário de Segurança (Alteração de Senha)
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  } = useForm<UpdatePasswordSchemaType>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setFeedbackMessage(null);
    try {
      await updateProfileMutation.mutateAsync(data);
      setFeedbackMessage({ type: 'success', text: 'Dados de perfil atualizados com sucesso!' });
    } catch (err) {
      const appErr = handleAxiosError(err);
      setFeedbackMessage({ type: 'error', text: appErr.message });
    }
  };

  const onPasswordSubmit = async (data: UpdatePasswordSchemaType) => {
    setFeedbackMessage(null);
    try {
      const msg = await authService.updatePassword(data);
      setFeedbackMessage({ type: 'success', text: msg || 'Senha alterada com sucesso!' });
      resetPassword();
    } catch (err) {
      const appErr = handleAxiosError(err);
      setFeedbackMessage({ type: 'error', text: appErr.message });
    }
  };

  const handleSavePreferences = async (prefs: PreferencesPayload) => {
    setFeedbackMessage(null);
    try {
      await updatePreferencesMutation.mutateAsync(prefs);
      setFeedbackMessage({ type: 'success', text: 'Preferências salvas com sucesso!' });
    } catch (err) {
      const appErr = handleAxiosError(err);
      setFeedbackMessage({ type: 'error', text: appErr.message });
    }
  };

  return (
    <div
      style={{
        maxWidth: '760px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)',
      }}
    >
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Configurações e Perfil
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Gerencie seus dados pessoais, credenciais de acesso e preferências do FinanceHub
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--spacing-xs)',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '2px',
        }}
      >
        <button
          type="button"
          onClick={() => {
            setActiveTab('profile');
            setFeedbackMessage(null);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'none',
            border: 'none',
            borderBottom:
              activeTab === 'profile' ? '2px solid var(--primary-700)' : '2px solid transparent',
            color: activeTab === 'profile' ? 'var(--primary-700)' : 'var(--text-muted)',
            fontWeight: activeTab === 'profile' ? 600 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          <UserIcon size={16} />
          <span>Meu Perfil</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('security');
            setFeedbackMessage(null);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'none',
            border: 'none',
            borderBottom:
              activeTab === 'security' ? '2px solid var(--primary-700)' : '2px solid transparent',
            color: activeTab === 'security' ? 'var(--primary-700)' : 'var(--text-muted)',
            fontWeight: activeTab === 'security' ? 600 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          <Shield size={16} />
          <span>Segurança</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('preferences');
            setFeedbackMessage(null);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'none',
            border: 'none',
            borderBottom:
              activeTab === 'preferences'
                ? '2px solid var(--primary-700)'
                : '2px solid transparent',
            color: activeTab === 'preferences' ? 'var(--primary-700)' : 'var(--text-muted)',
            fontWeight: activeTab === 'preferences' ? 600 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          <Sliders size={16} />
          <span>Preferências</span>
        </button>
      </div>

      {/* Alerta de Feedback */}
      {feedbackMessage && (
        <div
          style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            backgroundColor: feedbackMessage.type === 'success' ? 'var(--income-bg)' : '#fef2f2',
            border: `1px solid ${feedbackMessage.type === 'success' ? 'var(--income-border)' : '#fee2e2'}`,
            borderRadius: 'var(--radius-md)',
            color: feedbackMessage.type === 'success' ? 'var(--income-text)' : '#dc2626',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {feedbackMessage.type === 'success' ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Aba 1: Perfil */}
      {activeTab === 'profile' && (
        <Card
          title="Dados Pessoais"
          subtitle="Mantenha seus dados de contato e identificação atualizados"
        >
          {isLoadingProfile ? (
            <p style={{ color: 'var(--text-muted)' }}>Carregando dados...</p>
          ) : (
            <form
              onSubmit={handleSubmitProfile(onProfileSubmit)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-md)',
                marginTop: 'var(--spacing-md)',
              }}
            >
              <Input
                label="Nome Completo"
                placeholder="Seu nome"
                error={profileErrors.name?.message}
                {...registerProfile('name')}
              />

              <Input
                label="Endereço de E-mail"
                type="email"
                placeholder="seu.email@exemplo.com"
                error={profileErrors.email?.message}
                {...registerProfile('email')}
              />

              <div
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8125rem',
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>Perfil de Acesso (RBAC):</span>
                <span
                  style={{
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    backgroundColor: user?.role?.name === 'admin' ? '#fef3c7' : 'var(--bg-surface)',
                    color: user?.role?.name === 'admin' ? '#b45309' : 'var(--text-main)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {user?.role?.name || 'user'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: 'var(--spacing-xs)',
                }}
              >
                <Button type="submit" isLoading={isSubmittingProfile}>
                  Salvar Alterações
                </Button>
              </div>
            </form>
          )}
        </Card>
      )}

      {/* Aba 2: Segurança */}
      {activeTab === 'security' && (
        <Card
          title="Alteração de Senha"
          subtitle="Crie uma nova senha forte para proteger sua conta"
        >
          <form
            onSubmit={handleSubmitPassword(onPasswordSubmit)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-md)',
              marginTop: 'var(--spacing-md)',
            }}
          >
            <Input
              label="Senha Atual"
              type="password"
              placeholder="••••••••"
              error={passwordErrors.current_password?.message}
              {...registerPassword('current_password')}
            />

            <Input
              label="Nova Senha"
              type="password"
              placeholder="Mínimo 8 caracteres"
              error={passwordErrors.password?.message}
              {...registerPassword('password')}
            />

            <Input
              label="Confirmar Nova Senha"
              type="password"
              placeholder="Repita a nova senha"
              error={passwordErrors.password_confirmation?.message}
              {...registerPassword('password_confirmation')}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 'var(--spacing-xs)',
              }}
            >
              <Button type="submit" isLoading={isSubmittingPassword}>
                Atualizar Senha
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Aba 3: Preferências */}
      {activeTab === 'preferences' && (
        <PreferencesTab
          key={JSON.stringify(user?.preferences || {})}
          initialPreferences={user?.preferences}
          onSave={handleSavePreferences}
          isSaving={updatePreferencesMutation.isPending}
        />
      )}
    </div>
  );
};
