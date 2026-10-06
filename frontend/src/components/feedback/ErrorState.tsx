import React from 'react';
import { Button } from '@/components/ui/Button/Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Ocorreu um erro ao carregar os dados',
  message = 'Não foi possível carregar as informações. Verifique sua conexão e tente novamente.',
  onRetry,
}) => {
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
        border: '1px solid #fee2e2',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#fef2f2',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--spacing-md)',
          fontSize: '1.25rem',
          fontWeight: 'bold',
        }}
      >
        !
      </div>
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
      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          maxWidth: '420px',
          marginBottom: onRetry ? 'var(--spacing-lg)' : 0,
        }}
      >
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
};
