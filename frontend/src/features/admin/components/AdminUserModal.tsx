import React, { useState } from 'react';
import { Modal } from '@/components/feedback/Modal';
import { Button } from '@/components/ui/Button/Button';
import { AlertCircle } from 'lucide-react';
import type { AdminUser, RoleItem } from '../types/admin.types';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface AdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  roles: RoleItem[];
  onSave: (id: number, data: { role_id: number; status: 'ACTIVE' | 'INACTIVE' }) => Promise<void>;
  isSaving: boolean;
}

interface AdminUserFormContentProps {
  user: AdminUser;
  roles: RoleItem[];
  onSave: (id: number, data: { role_id: number; status: 'ACTIVE' | 'INACTIVE' }) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

const AdminUserFormContent: React.FC<AdminUserFormContentProps> = ({
  user,
  roles,
  onSave,
  onClose,
  isSaving,
}) => {
  const { user: currentUser } = useAuth();
  const [selectedRoleId, setSelectedRoleId] = useState<number>(user.role_id);
  const [selectedStatus, setSelectedStatus] = useState<'ACTIVE' | 'INACTIVE'>(user.status);
  const [error, setError] = useState<string | null>(null);

  const isSelf = currentUser?.id === user.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSelf && selectedStatus === 'INACTIVE') {
      setError('Você não pode desativar sua própria conta de administrador.');
      return;
    }

    try {
      await onSave(user.id, {
        role_id: selectedRoleId,
        status: selectedStatus,
      });
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao salvar alterações do usuário.');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}
    >
      {error && (
        <div
          style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            backgroundColor: '#fef2f2',
            border: '1px solid #fee2e2',
            borderRadius: 'var(--radius-md)',
            color: '#dc2626',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {isSelf && (
        <div
          style={{
            padding: 'var(--spacing-sm)',
            backgroundColor: '#fffbeb',
            border: '1px solid #fef3c7',
            borderRadius: 'var(--radius-md)',
            color: '#b45309',
            fontSize: '0.75rem',
          }}
        >
          Atenção: Você está editando sua própria conta. Por segurança, desativação e rebaixamento
          de perfil estão bloqueados.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
          E-mail
        </label>
        <input
          type="text"
          disabled
          value={user.email}
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-muted)',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
          Papel de Acesso (RBAC)
        </label>
        <select
          value={selectedRoleId}
          onChange={e => setSelectedRoleId(Number(e.target.value))}
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-main)',
            fontSize: '0.875rem',
          }}
        >
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.label} ({role.name})
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
          Status da Conta
        </label>
        <select
          value={selectedStatus}
          disabled={isSelf}
          onChange={e => setSelectedStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            backgroundColor: isSelf ? 'var(--bg-muted)' : 'var(--bg-surface)',
            color: 'var(--text-main)',
            fontSize: '0.875rem',
          }}
        >
          <option value="ACTIVE">ATIVO</option>
          <option value="INACTIVE">INATIVO (Bloqueado)</option>
        </select>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
          marginTop: 'var(--spacing-sm)',
        }}
      >
        <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSaving}>
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
};

export const AdminUserModal: React.FC<AdminUserModalProps> = ({
  isOpen,
  onClose,
  user,
  roles,
  onSave,
  isSaving,
}) => {
  if (!isOpen || !user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar Usuário: ${user.name}`}
      description="Gerencie as permissões e o status de acesso deste usuário"
    >
      <AdminUserFormContent
        key={user.id}
        user={user}
        roles={roles}
        onSave={onSave}
        onClose={onClose}
        isSaving={isSaving}
      />
    </Modal>
  );
};
