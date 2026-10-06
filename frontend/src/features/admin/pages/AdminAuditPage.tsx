import React, { useState } from 'react';
import { History, Search, Eye } from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { useAdminAuditLogs } from '../hooks/useAdmin';
import { AuditLogDetailModal } from '../components/AuditLogDetailModal';
import type { AuditLogItem } from '../types/admin.types';

export const AdminAuditPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('');
  const [inspectingLog, setInspectingLog] = useState<AuditLogItem | null>(null);

  const { data: logsData, isLoading: isLoadingLogs } = useAdminAuditLogs({
    search: search || undefined,
    action: selectedAction || undefined,
    entity_type: selectedEntity || undefined,
  });

  const logs = logsData?.data ?? [];

  const getActionBadgeColor = (action: string) => {
    if (action.includes('DELETE')) return { bg: '#fef2f2', text: '#dc2626' };
    if (action.includes('CREATE')) return { bg: 'var(--income-bg)', text: 'var(--income-text)' };
    if (action.includes('UPDATE')) return { bg: '#eff6ff', text: '#2563eb' };
    return { bg: 'var(--bg-muted)', text: 'var(--text-main)' };
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)',
      }}
    >
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
          <History size={24} color="var(--primary-700)" />
          <span>Logs de Auditoria e Rastreabilidade</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Registro imutável de operações financeiras, acessos e alterações administrativas
        </p>
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
              placeholder="Buscar por ação, entidade ou IP..."
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
              value={selectedAction}
              onChange={e => setSelectedAction(e.target.value)}
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
              <option value="">Todas as Ações</option>
              <option value="TRANSACTION_CREATE">TRANSACTION_CREATE</option>
              <option value="TRANSACTION_UPDATE">TRANSACTION_UPDATE</option>
              <option value="TRANSACTION_DELETE">TRANSACTION_DELETE</option>
              <option value="TRANSFER_CREATE">TRANSFER_CREATE</option>
              <option value="PROFILE_UPDATE">PROFILE_UPDATE</option>
              <option value="PREFERENCES_UPDATE">PREFERENCES_UPDATE</option>
              <option value="PASSWORD_CHANGE">PASSWORD_CHANGE</option>
              <option value="ADMIN_USER_UPDATE">ADMIN_USER_UPDATE</option>
            </select>
          </div>

          <div style={{ flex: '0 1 160px' }}>
            <select
              value={selectedEntity}
              onChange={e => setSelectedEntity(e.target.value)}
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
              <option value="">Todas Entidades</option>
              <option value="Transaction">Transação</option>
              <option value="Account">Conta</option>
              <option value="Category">Categoria</option>
              <option value="User">Usuário</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tabela de Logs */}
      <Card>
        {isLoadingLogs ? (
          <div
            style={{
              padding: 'var(--spacing-xl)',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            Carregando trilha de auditoria...
          </div>
        ) : logs.length === 0 ? (
          <div
            style={{
              padding: 'var(--spacing-xl)',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            Nenhum evento de auditoria localizado.
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
                  <th style={{ padding: '12px' }}>Data / Hora</th>
                  <th style={{ padding: '12px' }}>Ação</th>
                  <th style={{ padding: '12px' }}>Entidade</th>
                  <th style={{ padding: '12px' }}>Usuário</th>
                  <th style={{ padding: '12px' }}>Endereço IP</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log: AuditLogItem) => {
                  const colors = getActionBadgeColor(log.action);
                  return (
                    <tr
                      key={log.id}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'background-color var(--transition-fast)',
                      }}
                    >
                      <td style={{ padding: '12px', fontSize: '0.8125rem' }}>
                        {new Date(log.created_at).toLocaleString('pt-BR')}
                      </td>

                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: colors.bg,
                            color: colors.text,
                          }}
                        >
                          {log.action}
                        </span>
                      </td>

                      <td style={{ padding: '12px', fontWeight: 500 }}>
                        {log.entity_type} {log.entity_id ? `#${log.entity_id}` : ''}
                      </td>

                      <td style={{ padding: '12px' }}>
                        {log.user ? (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600 }}>{log.user.name}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {log.user.email}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Sistema</span>
                        )}
                      </td>

                      <td
                        style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.75rem' }}
                      >
                        {log.ip_address || '—'}
                      </td>

                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <Button
                          variant="ghost"
                          onClick={() => setInspectingLog(log)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Eye size={14} />
                          <span>Ver Diff</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal de Detalhes do Log */}
      <AuditLogDetailModal
        isOpen={Boolean(inspectingLog)}
        onClose={() => setInspectingLog(null)}
        log={inspectingLog}
      />
    </div>
  );
};
