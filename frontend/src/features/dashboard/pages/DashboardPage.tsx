import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight,
  Scale,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAccounts } from '@/features/accounts/hooks/useAccounts';
import { useTransactions } from '@/features/transactions/hooks/useTransactions';
import { TransactionFormModal } from '@/features/transactions/components/TransactionFormModal';
import { useDashboard } from '../hooks/useDashboard';
import { CashFlowChart } from '../components/CashFlowChart';
import { ExpensesPieChart } from '../components/ExpensesPieChart';
import { MetricKpiCard } from '../components/MetricKpiCard';
import type { TransactionType } from '@/features/transactions/types/transaction.types';
import type { TransactionSchemaType } from '@/features/transactions/schemas/transaction.schema';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { accounts } = useAccounts();
  const { createTransaction } = useTransactions(undefined, { enabled: false });
  const { metrics, cashFlow, expensesByCategory, recentTransactions, isLoading, isError, refetch } =
    useDashboard();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>('EXPENSE');

  const handleOpenModal = (type: TransactionType) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: TransactionSchemaType) => {
    await createTransaction({
      ...data,
      notes: data.notes || null,
    });
    refetch();
  };

  if (isLoading) {
    return <LoadingState lines={8} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar o painel"
        message="Não foi possível obter os dados financeiros consolidados. Tente novamente."
        onRetry={refetch}
      />
    );
  }

  const totalBalanceNum = parseFloat(metrics?.total_balance || '0');
  const monthlyIncomeNum = parseFloat(metrics?.monthly_income || '0');
  const monthlyExpenseNum = parseFloat(metrics?.monthly_expense || '0');
  const monthlyNetNum = parseFloat(metrics?.monthly_net || '0');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Header com Boas-vindas e Ações Rápidas */}
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
            Olá, {user?.name || 'Investidor'}! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Aqui está a visão consolidada das suas finanças e fluxo de caixa
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={() => handleOpenModal('EXPENSE')}>
            <Plus size={16} /> Despesa
          </Button>
          <Button variant="secondary" onClick={() => handleOpenModal('INCOME')}>
            <Plus size={16} /> Receita
          </Button>
          <Button variant="primary" onClick={() => handleOpenModal('TRANSFER')}>
            <RefreshCw size={16} /> Transferência
          </Button>
        </div>
      </div>

      {/* Grade de 4 Cards de Métricas (KPIs) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 'var(--spacing-md)',
        }}
      >
        <MetricKpiCard
          title="Saldo Consolidado"
          value={formatCurrency(totalBalanceNum)}
          icon={<Wallet size={20} />}
          variant="primary"
        />

        <MetricKpiCard
          title="Receitas do Mês"
          value={formatCurrency(monthlyIncomeNum)}
          icon={<ArrowDownLeft size={20} />}
          variant="income"
          percentChange={metrics?.income_change_percent}
        />

        <MetricKpiCard
          title="Despesas do Mês"
          value={formatCurrency(monthlyExpenseNum)}
          icon={<ArrowUpRight size={20} />}
          variant="expense"
          percentChange={metrics?.expense_change_percent}
        />

        <MetricKpiCard
          title="Resultado Líquido"
          value={formatCurrency(monthlyNetNum)}
          icon={<Scale size={20} />}
          variant={monthlyNetNum >= 0 ? 'income' : 'expense'}
          percentChange={metrics?.savings_rate}
          comparisonLabel="taxa de poupança"
        />
      </div>

      {/* Grid Principal de Gráficos (Lado a Lado) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 'var(--spacing-lg)',
        }}
      >
        {/* Fluxo de Caixa Recente */}
        <Card
          title="Fluxo de Caixa dos Últimos Meses"
          subtitle="Comparativo mensal entre receitas recebidas e despesas liquidadas"
        >
          <CashFlowChart data={cashFlow} />
        </Card>

        {/* Despesas por Categoria */}
        <Card
          title="Despesas por Categoria"
          subtitle="Distribuição dos seus gastos por categoria no mês atual"
        >
          <ExpensesPieChart data={expensesByCategory} />
        </Card>
      </div>

      {/* Seção Inferior: Últimas Transações e Contas Bancárias */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 'var(--spacing-lg)',
        }}
      >
        {/* Últimas Transações */}
        <Card
          title="Movimentações Recentes"
          subtitle="Últimos lançamentos registrados na sua conta"
        >
          {recentTransactions.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Nenhuma movimentação registrada recentemente.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {recentTransactions.map(tx => {
                const isIncome = tx.type === 'INCOME';
                const isExpense = tx.type === 'EXPENSE';
                const isTransfer = tx.type === 'TRANSFER';
                const val = parseFloat(tx.amount) || 0;

                return (
                  <div
                    key={tx.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-muted)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: isIncome
                            ? 'rgba(16, 185, 129, 0.15)'
                            : isExpense
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(59, 130, 246, 0.15)',
                          color: isIncome
                            ? 'var(--income-text)'
                            : isExpense
                              ? 'var(--expense-text)'
                              : 'var(--primary-600)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isIncome && <ArrowDownLeft size={16} />}
                        {isExpense && <ArrowUpRight size={16} />}
                        {isTransfer && <RefreshCw size={16} />}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: 'var(--text-main)',
                          }}
                        >
                          {tx.description}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {formatDate(tx.date)} • {tx.account?.name || 'Conta'}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        color: isIncome
                          ? 'var(--income-text)'
                          : isExpense
                            ? 'var(--expense-text)'
                            : 'var(--primary-600)',
                      }}
                    >
                      {isIncome && '+ '}
                      {isExpense && '- '}
                      {formatCurrency(val)}
                    </div>
                  </div>
                );
              })}

              <div style={{ marginTop: '8px', textAlign: 'right' }}>
                <Link
                  to="/transactions"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.875rem',
                    color: 'var(--primary-600)',
                    fontWeight: 600,
                  }}
                >
                  Ver extrato completo <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </Card>

        {/* Resumo de Contas Bancárias */}
        <Card
          title="Minhas Contas e Carteiras"
          subtitle="Saldos atuais distribuídos nas instituições"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {accounts.map(acc => (
              <div
                key={acc.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-muted)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: acc.color || 'var(--primary-500)',
                    }}
                  />
                  <div>
                    <div
                      style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}
                    >
                      {acc.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {acc.type}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {formatCurrency(parseFloat(acc.current_balance) || 0)}
                  </div>
                  <Badge
                    variant={acc.is_active ? 'success' : 'neutral'}
                    style={{ fontSize: '0.7rem' }}
                  >
                    {acc.is_active ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '8px', textAlign: 'right' }}>
              <Link
                to="/accounts"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.875rem',
                  color: 'var(--primary-600)',
                  fontWeight: 600,
                }}
              >
                Gerenciar contas <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal de Transação Rápida */}
      {isModalOpen && (
        <TransactionFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          defaultType={modalType}
        />
      )}
    </div>
  );
};
