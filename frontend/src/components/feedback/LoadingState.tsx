import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

export interface LoadingStateProps {
  lines?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ lines = 4 }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
        padding: 'var(--spacing-lg)',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
      }}
    >
      <Skeleton height="2rem" width="40%" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height="1.25rem" width={i % 2 === 0 ? '100%' : '80%'} />
      ))}
    </div>
  );
};
