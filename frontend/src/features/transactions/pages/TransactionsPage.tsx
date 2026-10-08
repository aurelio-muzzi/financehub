import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Edit2,
  Trash2,
  Calendar,
  Filter,
} from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { LoadingState } from '@/components/feedback/LoadingState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { useDebounce } from '@/hooks/useDebounce';
import { useAccounts } from '@/features/accounts/hooks/useAccounts';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionFormModal } from '../components/TransactionFormModal';
import type { Transaction, TransactionType, TransactionStatus } from '../types/transaction.types';
import type { TransactionSchemaType } from '../schemas/transaction.schema';

export const TransactionsPage: React.FC = () => {
  // Datas padrão: Início do mês atual até o dia de hoje
  const now = new Date();
  const defaultStartDate = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split('T')[0];
  const defaultEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0];

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [selectedType, setSelectedType] = useState<TransactionType | 'ALL'>('ALL');
  const [selectedAccountId, setSelectedAccountId] = useState<number | 'ALL'>('ALL');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<TransactionStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  const { accounts } = useAccounts();
  const { categories } = useCategories();

  const queryFilters = useMemo(
    () => ({
      type: selectedType === 'ALL' ? undefined : selectedType,
      account_id: selectedAccountId === 'ALL' ? undefined : selectedAccountId,
      category_id: selectedCategoryId === 'ALL' ? undefined : selectedCategoryId,
      status: selectedStatus === 'ALL' ? undefined : selectedStatus,
      start_date: startDate,
      end_date: endDate,
      search: debouncedSearch || undefined,
      page: currentPage,
      per_page: 15,
    }),
    [
      selectedType,
      selectedAccountId,
      selectedCategoryId,
      selectedStatus,
      startDate,
      endDate,
      debouncedSearch,
      currentPage,
    ]
  );

  const {
    transactions,
    pagination,
    summary,
    isLoading,
    isError,
    refetch,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions(queryFilters);

  const handleOpenCreateModal = () => {
    setTransactionToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tx: Transaction) => {
    setTransactionToEdit(tx);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = async (id: number) => {
    if (
      window.confirm(
        'Tem certeza que deseja excluir esta transação? Os saldos das contas serão recalculados.'
      )
    ) {
      await deleteTransaction(id);
    }
  };

  const handleModalSubmit = async (data: TransactionSchemaType) => {
    if (transactionToEdit) {
      await updateTransaction({
        id: transactionToEdit.id,
        payload: {
          ...data,
          notes: data.notes || null,
        },
      });
    } else {
      await createTransaction({
        ...data,
        notes: data.notes || null,
      });
    }
  };

  // Presets de Data
  const applyDatePreset = (
    preset: 'CURRENT_MONTH' | 'LAST_MONTH' | 'LAST_30_DAYS' | 'ALL_YEAR'
  ) => {
    const today = new Date();
    if (preset === 'CURRENT_MONTH') {
      setStartDate(new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]);
      setEndDate(
        new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]
      );
    } else if (preset === 'LAST_MONTH') {
      setStartDate(
        new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0]
      );
      setEndDate(new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0]);
    } else if (preset === 'LAST_30_DAYS') {
      const past30 = new Date();
      past30.setDate(today.getDate() - 30);
      setStartDate(past30.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    } else if (preset === 'ALL_YEAR') {
      setStartDate(new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0]);
      setEndDate(new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0]);
    }
    setCurrentPage(1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Header da Página */}
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
            Extrato de Movimentações
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Histórico completo de receitas, despesas e transferências entre contas
          </p>
        </div>
        <Button onClick={handleOpenCreateModal}>
          <Plus size={18} />
          Nova Movimentação
        </Button>
      </div>

      {/* Cards de Resumo Consolidado do Período */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--spacing-md)',
        }}
      >
        <Card style={{ borderLeft: '4px solid var(--income-main, #10b981)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Receitas do Período
              </span>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--income-text)',
                  marginTop: '4px',
                }}
              >
                {formatCurrency(parseFloat(summary?.total_income || '0'))}
              </div>
            </div>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--income-text)',
              }}
            >
              <ArrowDownLeft size={22} />
            </div>
          </div>
        </Card>

        <Card style={{ borderLeft: '4px solid var(--expense-main, #ef4444)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Despesas do Período
              </span>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--expense-text)',
                  marginTop: '4px',
                }}
              >
                {formatCurrency(parseFloat(summary?.total_expense || '0'))}
              </div>
            </div>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--expense-text)',
              }}
            >
              <ArrowUpRight size={22} />
            </div>
          </div>
        </Card>

        <Card style={{ borderLeft: '4px solid var(--primary-500, #3b82f6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Resultado Líquido
              </span>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color:
                    parseFloat(summary?.net_balance || '0') >= 0
                      ? 'var(--income-text)'
                      : 'var(--expense-text)',
                  marginTop: '4px',
                }}
              >
                {formatCurrency(parseFloat(summary?.net_balance || '0'))}
              </div>
            </div>
            <Badge variant="neutral" style={{ fontSize: '0.75rem' }}>
              {summary?.count || 0} oper.
            </Badge>
          </div>
        </Card>
      </div>

      {/* Barra de Filtros Avançados */}
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {/* Linha 1: Busca e Presets de Data */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-md)',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '220px' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                placeholder="Buscar por descrição ou notas..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 38px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  outline: 'none',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button variant="secondary" onClick={() => applyDatePreset('CURRENT_MONTH')}>
                Este Mês
              </Button>
              <Button variant="secondary" onClick={() => applyDatePreset('LAST_MONTH')}>
                Mês Anterior
              </Button>
              <Button variant="secondary" onClick={() => applyDatePreset('LAST_30_DAYS')}>
                Últimos 30d
              </Button>
              <Button variant="secondary" onClick={() => applyDatePreset('ALL_YEAR')}>
                Ano Atual
              </Button>
            </div>
          </div>

          {/* Linha 2: Filtros de Seleção (Tipo, Conta, Categoria, Período customizado) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 'var(--spacing-sm)',
              alignItems: 'center',
            }}
          >
            {/* Tipo */}
            <select
              value={selectedType}
              onChange={e => {
                setSelectedType(e.target.value as TransactionType | 'ALL');
                setCurrentPage(1);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
              }}
            >
              <option value="ALL">Todos os Tipos</option>
              <option value="EXPENSE">Apenas Despesas</option>
              <option value="INCOME">Apenas Receitas</option>
              <option value="TRANSFER">Apenas Transferências</option>
            </select>

            {/* Conta */}
            <select
              value={selectedAccountId}
              onChange={e => {
                const val = e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10);
                setSelectedAccountId(val);
                setCurrentPage(1);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
              }}
            >
              <option value="ALL">Todas as Contas</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>

            {/* Categoria */}
            <select
              value={selectedCategoryId}
              onChange={e => {
                const val = e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10);
                setSelectedCategoryId(val);
                setCurrentPage(1);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
              }}
            >
              <option value="ALL">Todas as Categorias</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={e => {
                setSelectedStatus(e.target.value as TransactionStatus | 'ALL');
                setCurrentPage(1);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
              }}
            >
              <option value="ALL">Todos os Status</option>
              <option value="COMPLETED">Concluídas</option>
              <option value="PENDING">Pendentes</option>
              <option value="CANCELLED">Canceladas</option>
            </select>

            {/* Data Início */}
            <input
              type="date"
              value={startDate}
              onChange={e => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
              }}
            />

            {/* Data Fim */}
            <input
              type="date"
              value={endDate}
              onChange={e => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
              }}
            />
          </div>
        </div>
      </Card>

      {/* Tabela de Transações / Estados de Feedback */}
      {isLoading ? (
        <LoadingState lines={6} />
      ) : isError ? (
        <ErrorState
          title="Erro ao carregar movimentações"
          message="Não foi possível obter o extrato. Tente novamente mais tarde."
          onRetry={refetch}
        />
      ) : transactions.length === 0 ? (
        <EmptyState
          icon={<Filter size={40} />}
          title="Nenhuma movimentação encontrada"
          description={
            searchTerm || selectedType !== 'ALL' || selectedAccountId !== 'ALL'
              ? 'Tente ajustar os filtros do extrato para visualizar mais dados.'
              : 'Registre sua primeira movimentação financeira para ver seu extrato detalhado.'
          }
          action={
            <Button onClick={handleOpenCreateModal}>
              <Plus size={16} />
              Nova Movimentação
            </Button>
          }
        />
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
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
                    backgroundColor: 'var(--bg-muted)',
                    borderBottom: '1px solid var(--border-light)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Data</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Descrição</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Categoria</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Conta</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>
                    Valor
                  </th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'center' }}>
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => {
                  const isIncome = tx.type === 'INCOME';
                  const isExpense = tx.type === 'EXPENSE';
                  const isTransfer = tx.type === 'TRANSFER';
                  const amountNum = parseFloat(tx.amount) || 0;

                  return (
                    <tr
                      key={tx.id}
                      style={{
                        borderBottom: '1px solid var(--border-light)',
                        transition: 'background-color var(--transition-fast)',
                      }}
                    >
                      {/* Data */}
                      <td
                        style={{
                          padding: '12px 16px',
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} />
                          {formatDate(tx.date)}
                        </div>
                      </td>

                      {/* Descrição & Notas */}
                      <td
                        style={{ padding: '12px 16px', color: 'var(--text-main)', fontWeight: 500 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
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
                              flexShrink: 0,
                            }}
                          >
                            {isIncome && <ArrowDownLeft size={16} />}
                            {isExpense && <ArrowUpRight size={16} />}
                            {isTransfer && <ArrowLeftRight size={16} />}
                          </div>
                          <div>
                            <div>{tx.description}</div>
                            {tx.payment_method && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {tx.payment_method}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Categoria */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        {isTransfer ? (
                          <Badge variant="neutral">Transferência</Badge>
                        ) : tx.category ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              backgroundColor: tx.category.color
                                ? `${tx.category.color}20`
                                : 'var(--bg-muted)',
                              color: tx.category.color || 'var(--text-main)',
                            }}
                          >
                            {tx.category.name}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            Geral
                          </span>
                        )}
                      </td>

                      {/* Conta */}
                      <td
                        style={{
                          padding: '12px 16px',
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {isTransfer ? (
                          <span>
                            {tx.account?.name} → {tx.destination_account?.name}
                          </span>
                        ) : (
                          <span>{tx.account?.name || 'Conta Padrão'}</span>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        {tx.status === 'COMPLETED' ? (
                          <Badge variant="success">Efetivada</Badge>
                        ) : tx.status === 'PENDING' ? (
                          <Badge variant="warning">Pendente</Badge>
                        ) : (
                          <Badge variant="danger">Cancelada</Badge>
                        )}
                      </td>

                      {/* Valor */}
                      <td
                        style={{
                          padding: '12px 16px',
                          textAlign: 'right',
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          color: isIncome
                            ? 'var(--income-text)'
                            : isExpense
                              ? 'var(--expense-text)'
                              : 'var(--primary-600)',
                        }}
                      >
                        {isIncome && '+ '}
                        {isExpense && '- '}
                        {formatCurrency(amountNum)}
                      </td>

                      {/* Ações */}
                      <td
                        style={{ padding: '12px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}
                      >
                        <div style={{ display: 'inline-flex', gap: 'var(--spacing-xs)' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(tx)}
                            style={{
                              padding: '6px',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              display: 'flex',
                            }}
                            title="Editar movimentação"
                            aria-label="Editar movimentação"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTransaction(tx.id)}
                            style={{
                              padding: '6px',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--expense-text)',
                              cursor: 'pointer',
                              display: 'flex',
                            }}
                            title="Excluir movimentação"
                            aria-label="Excluir movimentação"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {pagination && pagination.last_page > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--spacing-md) var(--spacing-lg)',
                borderTop: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Página {pagination.current_page} de {pagination.last_page} ({pagination.total}{' '}
                transações)
              </span>
              <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                <Button
                  variant="secondary"
                  disabled={pagination.current_page <= 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                >
                  Anterior
                </Button>
                <Button
                  variant="secondary"
                  disabled={pagination.current_page >= pagination.last_page}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, pagination.last_page))}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Modal de Criação / Edição */}
      {isModalOpen && (
        <TransactionFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          transactionToEdit={transactionToEdit}
        />
      )}
    </div>
  );
};
