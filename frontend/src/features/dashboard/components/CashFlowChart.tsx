import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { formatCurrency } from '@/utils/currency';
import type { CashFlowItem } from '../types/dashboard.types';

interface CashFlowChartProps {
  data: CashFlowItem[];
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({ data }) => {
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
        Nenhum dado de movimentação disponível para o período.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border-light, #e2e8f0)"
            opacity={0.6}
          />
          <XAxis
            dataKey="period"
            stroke="var(--text-muted, #94a3b8)"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="var(--text-muted, #94a3b8)"
            fontSize={12}
            tickLine={false}
            tickFormatter={val => `R$ ${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={value => [formatCurrency(Number(value) || 0)]}
            labelStyle={{ fontWeight: 600, color: 'var(--text-main, #0f172a)' }}
            contentStyle={{
              backgroundColor: 'var(--bg-surface, #ffffff)',
              borderRadius: 'var(--radius-md, 8px)',
              border: '1px solid var(--border-light, #e2e8f0)',
              boxShadow: 'var(--shadow-md)',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="income"
            name="Receitas"
            stroke="#10b981"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#incomeGradient)"
          />
          <Area
            type="monotone"
            dataKey="expense"
            name="Despesas"
            stroke="#ef4444"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#expenseGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
