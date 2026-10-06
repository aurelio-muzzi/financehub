import React, { useState } from 'react';
import { FileSpreadsheet, FileText, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { formatCurrency } from '@/utils/currency';
import { useReports } from '../hooks/useReports';

export const ReportsPage: React.FC = () => {
  const now = new Date();
  const defaultStartDate = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split('T')[0];
  const defaultEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0];

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const {
    report,
    isLoading,
    isError,
    refetch,
    exportCsv,
    exportPdf,
    isExportingCsv,
    isExportingPdf,
  } = useReports(startDate, endDate);

  const applyPreset = (preset: 'CURRENT_MONTH' | 'LAST_MONTH' | 'LAST_90_DAYS' | 'ALL_YEAR') => {
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
    } else if (preset === 'LAST_90_DAYS') {
      const past90 = new Date();
      past90.setDate(today.getDate() - 90);
      setStartDate(past90.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    } else if (preset === 'ALL_YEAR') {
      setStartDate(new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0]);
      setEndDate(new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0]);
    }
  };

  const totalIncome = parseFloat(report?.summary.total_income || '0');
  const totalExpense = parseFloat(report?.summary.total_expense || '0');
  const netBalance = parseFloat(report?.summary.net_balance || '0');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Header da Tela com Botões de Exportação */}
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
            Relatórios e Análises
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Consolidação analítica por categorias e exportação profissional de dados
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={exportCsv} isLoading={isExportingCsv}>
            <FileSpreadsheet size={16} />
            Exportar CSV
          </Button>
          <Button variant="primary" onClick={exportPdf} isLoading={isExportingPdf}>
            <FileText size={16} />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Barra de Filtro de Período e Presets */}
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'var(--spacing-md)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
                  Período:
                </span>
              </div>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem',
                }}
              />
              <span style={{ color: 'var(--text-muted)' }}>até</span>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Button variant="secondary" onClick={() => applyPreset('CURRENT_MONTH')}>
                Este Mês
              </Button>
              <Button variant="secondary" onClick={() => applyPreset('LAST_MONTH')}>
                Mês Anterior
              </Button>
              <Button variant="secondary" onClick={() => applyPreset('LAST_90_DAYS')}>
                Últimos 90d
              </Button>
              <Button variant="secondary" onClick={() => applyPreset('ALL_YEAR')}>
                Ano Atual
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Estados de Carregamento e Erro */}
      {isLoading ? (
        <LoadingState lines={8} />
      ) : isError ? (
        <ErrorState
          title="Erro ao carregar o relatório analítico"
          message="Não foi possível apurar os dados do período. Tente novamente."
          onRetry={refetch}
        />
      ) : (
        <>
          {/* Cards de Resumo do Período */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: 'var(--spacing-md)',
            }}
          >
            <Card style={{ borderLeft: '4px solid var(--income-main, #10b981)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Total de Receitas
              </span>
              <div
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  color: 'var(--income-text)',
                  marginTop: '4px',
                }}
              >
                {formatCurrency(totalIncome)}
              </div>
            </Card>

            <Card style={{ borderLeft: '4px solid var(--expense-main, #ef4444)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Total de Despesas
              </span>
              <div
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  color: 'var(--expense-text)',
                  marginTop: '4px',
                }}
              >
                {formatCurrency(totalExpense)}
              </div>
            </Card>

            <Card style={{ borderLeft: '4px solid var(--primary-500, #3b82f6)' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Resultado Líquido
                </span>
                <Badge variant="neutral">{report?.summary.total_count || 0} oper.</Badge>
              </div>
              <div
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  color: netBalance >= 0 ? 'var(--income-text)' : 'var(--expense-text)',
                  marginTop: '4px',
                }}
              >
                {formatCurrency(netBalance)}
              </div>
            </Card>
          </div>

          {/* Gráficos / Listas Analíticas por Categoria (Receitas vs Despesas) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: 'var(--spacing-lg)',
            }}
          >
            {/* Despesas por Categoria */}
            <Card
              title="Despesas por Categoria"
              subtitle="Detalhamento percentual e volumétrico de saídas"
            >
              {report?.expenses_by_category.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Nenhuma despesa registrada no período.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  {report?.expenses_by_category.map(item => (
                    <div
                      key={item.category_id ?? item.name}
                      style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: item.color || '#ef4444',
                            }}
                          />
                          <span
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: 'var(--text-main)',
                            }}
                          >
                            {item.name}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            ({item.count} ops)
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: 700,
                              color: 'var(--expense-text)',
                            }}
                          >
                            {formatCurrency(item.amount)}
                          </span>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              marginLeft: '6px',
                            }}
                          >
                            ({item.percentage}%)
                          </span>
                        </div>
                      </div>

                      {/* Barra de Progresso Visual */}
                      <div
                        style={{
                          width: '100%',
                          height: '6px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--bg-muted)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${item.percentage}%`,
                            height: '100%',
                            backgroundColor: item.color || '#ef4444',
                            borderRadius: 'var(--radius-full)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Receitas por Categoria */}
            <Card
              title="Receitas por Categoria"
              subtitle="Detalhamento volumétrico de fontes de entrada"
            >
              {report?.incomes_by_category.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Nenhuma receita registrada no período.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  {report?.incomes_by_category.map(item => (
                    <div
                      key={item.category_id ?? item.name}
                      style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: item.color || '#10b981',
                            }}
                          />
                          <span
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: 'var(--text-main)',
                            }}
                          >
                            {item.name}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            ({item.count} ops)
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: 700,
                              color: 'var(--income-text)',
                            }}
                          >
                            {formatCurrency(item.amount)}
                          </span>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              marginLeft: '6px',
                            }}
                          >
                            ({item.percentage}%)
                          </span>
                        </div>
                      </div>

                      {/* Barra de Progresso Visual */}
                      <div
                        style={{
                          width: '100%',
                          height: '6px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--bg-muted)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${item.percentage}%`,
                            height: '100%',
                            backgroundColor: item.color || '#10b981',
                            borderRadius: 'var(--radius-full)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
