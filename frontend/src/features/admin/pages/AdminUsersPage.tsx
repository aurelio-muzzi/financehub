import React, { useState } from 'react';
import { Users, Search, Edit3, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { useAdminUsers, useAdminRoles, useUpdateAdminUser } from '../hooks/useAdmin';
import { AdminUserModal } from '../components/AdminUserModal';
import type { AdminUser } from '../types/admin.types';

export const AdminUsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const { data: usersData, isLoading: isLoadingUsers } = useAdminUsers({
    search: search || undefined,
    role_id: selectedRole || undefined,
    status: selectedStatus || undefined,
  });

  const { data: roles = [] } = useAdminRoles();
  const updateUserMutation = useUpdateAdminUser();

  const users = usersData?.data ?? [];

  const handleSaveUser = async (
    id: number,
    data: { role_id: number; status: 'ACTIVE' | 'INACTIVE' }
  ) => {
    await updateUserMutation.mutateAsync({ id, payload: data });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Users size={24} color="var(--primary-700)" />
            <span>Gerenciamento de Usuários e RBAC</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Controle de acessos, papéis de usuário e status de contas no FinanceHub
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-md)',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              flex: '1 1 240px',
            }}
          >
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                border: 'none',
                background: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.875rem',
                color: 'var(--text-main)',
              }}
            />
          </div>

          <div style={{ flex: '0 1 180px' }}>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
              }}
            >
              <option value="">Todos os Papéis</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: '0 1 160px' }}>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
              }}
            >
              <option value="">Todos os Status</option>
              <option value="ACTIVE">Ativos</option>
              <option value="INACTIVE">Inativos</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tabela de Usuários */}
      <Card>
        {isLoadingUsers ? (
          <div
            style={{
              padding: 'var(--spacing-xl)',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            Carregando usuários do sistema...
          </div>
        ) : users.length === 0 ? (
          <div
            style={{
              padding: 'var(--spacing-xl)',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            Nenhum usuário encontrado com os filtros selecionados.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.875rem',
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <th style={{ padding: '12px' }}>Usuário</th>
                  <th style={{ padding: '12px' }}>Papel (RBAC)</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Contas</th>
                  <th style={{ padding: '12px' }}>Transações</th>
                  <th style={{ padding: '12px' }}>Criado em</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: AdminUser) => (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background-color var(--transition-fast)',
                    }}
                  >
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{u.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {u.email}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: u.role?.name === 'admin' ? '#fef3c7' : 'var(--bg-muted)',
                          color: u.role?.name === 'admin' ? '#b45309' : 'var(--text-main)',
                        }}
                      >
                        <Shield size={12} />
                        {u.role?.label || u.role?.name || 'Usuário'}
                      </span>
                    </td>

                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: u.status === 'ACTIVE' ? 'var(--income-bg)' : '#fef2f2',
                          color: u.status === 'ACTIVE' ? 'var(--income-text)' : '#dc2626',
                        }}
                      >
                        {u.status === 'ACTIVE' ? (
                          <>
                            <CheckCircle size={12} />
                            <span>ATIVO</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={12} />
                            <span>INATIVO</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                      {u.accounts_count}
                    </td>

                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                      {u.transactions_count}
                    </td>

                    <td
                      style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.75rem' }}
                    >
                      {new Date(u.created_at).toLocaleDateString('pt-BR')}
                    </td>

                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <Button
                        variant="ghost"
                        onClick={() => setEditingUser(u)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Edit3 size={14} />
                        <span>Editar</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal de Edição */}
      <AdminUserModal
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        roles={roles}
        onSave={handleSaveUser}
        isSaving={updateUserMutation.isPending}
      />
    </div>
  );
};
