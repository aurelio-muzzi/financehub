import React from 'react';
import { Modal } from '@/components/feedback/Modal';
import { Button } from '@/components/ui/Button/Button';
import type { AuditLogItem } from '../types/admin.types';

interface AuditLogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLogItem | null;
}

export const AuditLogDetailModal: React.FC<AuditLogDetailModalProps> = ({
  isOpen,
  onClose,
  log,
}) => {
  if (!log) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalhes da Auditoria #${log.id}`}
      description={`Ação ${log.action} realizada na entidade ${log.entity_type}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-sm)',
            fontSize: '0.8125rem',
            backgroundColor: 'var(--bg-muted)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Usuário: </span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
              {log.user ? `${log.user.name} (${log.user.email})` : 'Sistema / Anônimo'}
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)' }}>Data e Hora: </span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
              {new Date(log.created_at).toLocaleString('pt-BR')}
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)' }}>IP: </span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
              {log.ip_address || 'N/A'}
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)' }}>ID da Entidade: </span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
              {log.entity_id ?? 'N/A'}
            </span>
          </div>
        </div>

        {/* Diff de Valores */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#dc2626',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Valores Anteriores (Old)
            </span>
            <pre
              style={{
                backgroundColor: 'var(--bg-app)',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                border: '1px solid var(--border-color)',
                overflowX: 'auto',
                maxHeight: '200px',
                margin: 0,
              }}
            >
              {log.old_values ? JSON.stringify(log.old_values, null, 2) : 'Nenhum'}
            </pre>
          </div>

          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#16a34a',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Novos Valores (New)
            </span>
            <pre
              style={{
                backgroundColor: 'var(--bg-app)',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                border: '1px solid var(--border-color)',
                overflowX: 'auto',
                maxHeight: '200px',
                margin: 0,
              }}
            >
              {log.new_values ? JSON.stringify(log.new_values, null, 2) : 'Nenhum'}
            </pre>
          </div>
        </div>

        {log.user_agent && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <strong>Navegador / User-Agent:</strong> {log.user_agent}
          </div>
        )}

        <div
          style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-sm)' }}
        >
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
