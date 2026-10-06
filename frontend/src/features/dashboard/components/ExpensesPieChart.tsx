import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatCurrency } from '@/utils/currency';
import type { CategoryExpenseItem } from '../types/dashboard.types';

interface ExpensesPieChartProps {
  data: CategoryExpenseItem[];
}

export const ExpensesPieChart: React.FC<ExpensesPieChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
        }}
      >
        Nenhuma despesa registrada no período.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '300px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#64748b'} />
              ))}
            </Pie>
            <Tooltip
              formatter={value => [formatCurrency(Number(value) || 0), 'Total']}
              contentStyle={{
                backgroundColor: 'var(--bg-surface, #ffffff)',
                borderRadius: 'var(--radius-md, 8px)',
                border: '1px solid var(--border-light, #e2e8f0)',
                boxShadow: 'var(--shadow-md)',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda compacta com porcentagens */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px 12px',
          justifyContent: 'center',
          marginTop: '8px',
          maxHeight: '80px',
          overflowY: 'auto',
        }}
      >
        {data.slice(0, 6).map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: item.color || '#64748b',
                display: 'inline-block',
              }}
            />
            <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{item.name}</span>
            <span>({item.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};
