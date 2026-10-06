import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricKpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  variant?: 'primary' | 'income' | 'expense' | 'neutral';
  percentChange?: number;
  comparisonLabel?: string;
}

export const MetricKpiCard: React.FC<MetricKpiCardProps> = ({
  title,
  value,
  icon,
  variant = 'primary',
  percentChange,
  comparisonLabel = 'vs mês anterior',
}) => {
  const getBorderColor = () => {
    switch (variant) {
      case 'income':
        return 'var(--income-main, #10b981)';
      case 'expense':
        return 'var(--expense-main, #ef4444)';
      case 'neutral':
        return 'var(--primary-600, #2563eb)';
      default:
        return 'var(--primary-500, #3b82f6)';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'income':
        return 'var(--income-text, #059669)';
      case 'expense':
        return 'var(--expense-text, #dc2626)';
      default:
        return 'var(--text-main, #0f172a)';
    }
  };

  return (
    <Card
      style={{
        borderLeft: `4px solid ${getBorderColor()}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {title}
        </span>
        <div style={{ color: getBorderColor() }}>{icon}</div>
      </div>

      <div
        style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: getTextColor(),
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </div>

      {percentChange !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
          {percentChange > 0 ? (
            <Badge
              variant="success"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
              }}
            >
              <TrendingUp size={12} />+{percentChange}%
            </Badge>
          ) : percentChange < 0 ? (
            <Badge
              variant="danger"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
              }}
            >
              <TrendingDown size={12} />
              {percentChange}%
            </Badge>
          ) : (
            <Badge
              variant="neutral"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
              }}
            >
              <Minus size={12} />
              0%
            </Badge>
          )}
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comparisonLabel}</span>
        </div>
      )}
    </Card>
  );
};
