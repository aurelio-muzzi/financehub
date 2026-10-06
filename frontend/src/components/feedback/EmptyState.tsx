import React from 'react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action, icon }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-2xl) var(--spacing-md)',
        textAlign: 'center',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-light)',
      }}
    >
      {icon && (
        <div style={{ marginBottom: 'var(--spacing-md)', color: 'var(--text-subtle)' }}>{icon}</div>
      )}
      <h4
        style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: 'var(--text-main)',
          marginBottom: 'var(--spacing-xs)',
        }}
      >
        {title}
      </h4>
      {description && (
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            maxWidth: '400px',
            marginBottom: action ? 'var(--spacing-lg)' : 0,
          }}
        >
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};
