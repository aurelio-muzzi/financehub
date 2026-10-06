import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { formatCurrency } from '@/utils/currency';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Header da Tela */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xs)',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--spacing-md)',
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Painel Financeiro
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Visão consolidada das suas contas e fluxo de caixa
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <Button variant="secondary">+ Despesa</Button>
            <Button variant="primary">+ Receita</Button>
          </div>
        </div>
      </div>

      {/* Grid de Cards de Indicadores (Mobile 1 col -> Tablet 2 cols -> Desktop 4 cols) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--spacing-md)',
        }}
      >
        <Card>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <div>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Saldo Total
              </span>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginTop: 'var(--spacing-xs)',
                  color: 'var(--text-main)',
                }}
              >
                {formatCurrency(0)}
              </div>
            </div>
            <div
              style={{
                padding: '8px',
                backgroundColor: 'var(--primary-100)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--primary-700)',
              }}
            >
              <Wallet size={20} />
            </div>
          </div>
          <div
            style={{
              marginTop: 'var(--spacing-sm)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
            }}
          >
            Saldo consolidado em todas as contas ativas
          </div>
        </Card>

        <Card>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <div>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Receitas do Mês
              </span>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginTop: 'var(--spacing-xs)',
                  color: 'var(--income-text)',
                }}
              >
                {formatCurrency(0)}
              </div>
            </div>
            <div
              style={{
                padding: '8px',
                backgroundColor: 'var(--income-bg)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--income-text)',
              }}
            >
              <ArrowUpRight size={20} />
            </div>
          </div>
          <div
            style={{
              marginTop: 'var(--spacing-sm)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
            }}
          >
            Entradas liquidadas e previstas
          </div>
        </Card>

        <Card>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <div>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Despesas do Mês
              </span>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginTop: 'var(--spacing-xs)',
                  color: 'var(--expense-text)',
                }}
              >
                {formatCurrency(0)}
              </div>
            </div>
            <div
              style={{
                padding: '8px',
                backgroundColor: 'var(--expense-bg)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--expense-text)',
              }}
            >
              <ArrowDownRight size={20} />
            </div>
          </div>
          <div
            style={{
              marginTop: 'var(--spacing-sm)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
            }}
          >
            Saídas liquidadas e contas a pagar
          </div>
        </Card>

        <Card>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <div>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Resultado Líquido
              </span>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginTop: 'var(--spacing-xs)',
                  color: 'var(--text-main)',
                }}
              >
                {formatCurrency(0)}
              </div>
            </div>
            <div
              style={{
                padding: '8px',
                backgroundColor: 'var(--bg-surface-hover)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
              }}
            >
              <TrendingUp size={20} />
            </div>
          </div>
          <div
            style={{
              marginTop: 'var(--spacing-sm)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
            }}
          >
            Superávit / Déficit do período
          </div>
        </Card>
      </div>

      {/* Seção Informativa de Status de Fundação */}
      <Card
        title="Fundação do Sistema Pronta"
        subtitle="Estrutura de arquitetura validada e preparada para conexão com a API"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            A camada base do frontend foi estruturada com design tokens, tipagem rigorosa,
            roteamento desacoplado, integração Axios com interceptor de CSRF para Laravel Sanctum e
            estados de feedback prontos.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-sm)',
              flexWrap: 'wrap',
              marginTop: 'var(--spacing-xs)',
            }}
          >
            <Badge variant="success">React 19 & TypeScript</Badge>
            <Badge variant="success">TanStack Query v5</Badge>
            <Badge variant="success">Zustand Client UI</Badge>
            <Badge variant="success">Mobile First Ready</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};
