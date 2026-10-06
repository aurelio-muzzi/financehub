import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Landmark,
  Edit2,
  Trash2,
  Wallet,
  CreditCard,
  Banknote,
  TrendingUp,
  HelpCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { LoadingState } from '@/components/feedback/LoadingState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { formatCurrency } from '@/utils/currency';
import { useAccounts } from '../hooks/useAccounts';
import { AccountFormModal } from '../components/AccountFormModal';
import { useDebounce } from '@/hooks/useDebounce';
import type { Account, AccountType } from '../types/account.types';
import type { AccountSchemaType } from '../schemas/account.schema';

const ACCOUNT_TYPE_CONFIG: Record<
  AccountType,
  { label: string; icon: React.FC<{ size?: number; color?: string }> }
> = {
  BANK: { label: 'Conta Bancária', icon: Landmark },
  DIGITAL_WALLET: { label: 'Carteira Digital', icon: Wallet },
  CASH: { label: 'Dinheiro em Espécie', icon: Banknote },
  INVESTMENT: { label: 'Investimentos', icon: TrendingUp },
  CREDIT_CARD: { label: 'Cartão de Crédito', icon: CreditCard },
  OTHER: { label: 'Outro', icon: HelpCircle },
};

export const AccountsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<AccountType | 'ALL'>('ALL');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<Account | null>(null);

  const { accounts, isLoading, isError, refetch, createAccount, updateAccount, deleteAccount } =
    useAccounts({
      type: selectedType === 'ALL' ? undefined : selectedType,
      search: debouncedSearch || undefined,
    });

  const totalConsolidatedBalance = useMemo(() => {
    return accounts
      .filter(a => a.is_active)
      .reduce((acc, curr) => acc + (parseFloat(curr.current_balance) || 0), 0);
  }, [accounts]);

  const handleOpenCreateModal = () => {
    setAccountToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (acc: Account) => {
    setAccountToEdit(acc);
    setIsModalOpen(true);
  };

  const handleDeleteAccount = async (id: number) => {
    if (
      window.confirm(
        'Tem certeza que deseja excluir esta conta bancária? As movimentações vinculadas serão afetadas.'
      )
    ) {
      await deleteAccount(id);
    }
  };

  const handleModalSubmit = async (data: AccountSchemaType) => {
    if (accountToEdit) {
      await updateAccount({ id: accountToEdit.id, payload: data });
    } else {
      await createAccount(data);
    }
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
            Contas e Carteiras
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Gerencie suas contas bancárias, carteiras digitais, investimentos e cartões
          </p>
        </div>
        <Button onClick={handleOpenCreateModal}>
          <Plus size={18} />
          Nova Conta
        </Button>
      </div>

      {/* Card de Resumo Consolidado */}
      <Card
        style={{
          background:
            'linear-gradient(135deg, var(--bg-surface) 0%, rgba(59, 130, 246, 0.05) 100%)',
          borderLeft: '4px solid var(--primary-500)',
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
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>
              Patrimônio Líquido em Contas Ativas
            </span>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: totalConsolidatedBalance >= 0 ? 'var(--income-text)' : 'var(--expense-text)',
                marginTop: '4px',
              }}
            >
              {formatCurrency(totalConsolidatedBalance)}
            </div>
          </div>
          <Badge variant="neutral" style={{ fontSize: '0.875rem', padding: '6px 14px' }}>
            {accounts.filter(a => a.is_active).length} Contas Ativas
          </Badge>
        </div>
      </Card>

      {/* Filtros e Busca */}
      <Card>
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-md)',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '200px' }}>
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
              placeholder="Buscar por nome da conta..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
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

          <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
            <Button
              variant={selectedType === 'ALL' ? 'primary' : 'secondary'}
              onClick={() => setSelectedType('ALL')}
            >
              Todas
            </Button>
            {Object.entries(ACCOUNT_TYPE_CONFIG).map(([typeKey, cfg]) => (
              <Button
                key={typeKey}
                variant={selectedType === typeKey ? 'primary' : 'secondary'}
                onClick={() => setSelectedType(typeKey as AccountType)}
              >
                {cfg.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Conteúdo: Loading, Error, Empty ou Lista em Grid */}
      {isLoading ? (
        <LoadingState lines={4} />
      ) : isError ? (
        <ErrorState
          title="Erro ao carregar contas"
          message="Não foi possível obter as contas financeiras. Tente novamente mais tarde."
          onRetry={refetch}
        />
      ) : accounts.length === 0 ? (
        <EmptyState
          icon={<Landmark size={40} />}
          title="Nenhuma conta encontrada"
          description={
            searchTerm || selectedType !== 'ALL'
              ? 'Tente ajustar os filtros de pesquisa.'
              : 'Cadastre sua primeira conta bancária ou carteira para começar a registrar transações.'
          }
          action={
            <Button onClick={handleOpenCreateModal}>
              <Plus size={16} />
              Cadastrar Conta
            </Button>
          }
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--spacing-md)',
          }}
        >
          {accounts.map(acc => {
            const config = ACCOUNT_TYPE_CONFIG[acc.type] || ACCOUNT_TYPE_CONFIG.OTHER;
            const IconComponent = config.icon;
            const balanceNum = parseFloat(acc.current_balance) || 0;

            return (
              <Card
                key={acc.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 'var(--spacing-md)',
                  opacity: acc.is_active ? 1 : 0.65,
                  transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 'var(--spacing-sm)',
                    }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: acc.color ? `${acc.color}20` : 'rgba(59, 130, 246, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: acc.color || 'var(--primary-500)',
                        }}
                      >
                        <IconComponent size={20} />
                      </div>
                      <div>
                        <h3
                          style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: 'var(--text-main)',
                            margin: 0,
                          }}
                        >
                          {acc.name}
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {config.label}
                        </span>
                      </div>
                    </div>

                    <Badge
                      variant={acc.is_active ? 'success' : 'neutral'}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {acc.is_active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>

                  <div style={{ marginTop: 'var(--spacing-sm)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Saldo Atual
                    </span>
                    <div
                      style={{
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        color: balanceNum >= 0 ? 'var(--income-text)' : 'var(--expense-text)',
                      }}
                    >
                      {formatCurrency(balanceNum)}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: 'var(--spacing-sm)',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Inicial: {formatCurrency(parseFloat(acc.initial_balance) || 0)}
                  </span>
                  <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(acc)}
                      style={{
                        padding: '6px',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                      }}
                      title="Editar conta"
                      aria-label="Editar conta"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAccount(acc.id)}
                      style={{
                        padding: '6px',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--expense-text)',
                        cursor: 'pointer',
                        display: 'flex',
                      }}
                      title="Excluir conta"
                      aria-label="Excluir conta"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de Criação / Edição */}
      <AccountFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        accountToEdit={accountToEdit}
      />
    </div>
  );
};
