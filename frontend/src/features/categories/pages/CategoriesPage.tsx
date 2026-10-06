import React, { useState } from 'react';
import { Plus, Search, Tag, Edit2, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { LoadingState } from '@/components/feedback/LoadingState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useCategories } from '../hooks/useCategories';
import { CategoryFormModal } from '../components/CategoryFormModal';
import { useDebounce } from '@/hooks/useDebounce';
import type { Category, CategoryType } from '../types/category.types';
import type { CategorySchemaType } from '../schemas/category.schema';

export const CategoriesPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<CategoryType>('EXPENSE');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const {
    categories,
    isLoading,
    isError,
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories({
    type: selectedType,
    search: debouncedSearch || undefined,
  });

  const handleOpenCreateModal = () => {
    setCategoryToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setCategoryToEdit(cat);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      await deleteCategory(id);
    }
  };

  const handleModalSubmit = async (data: CategorySchemaType) => {
    if (categoryToEdit) {
      await updateCategory({ id: categoryToEdit.id, payload: data });
    } else {
      await createCategory(data);
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
            Categorias Financeiras
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Organize suas receitas e despesas por categorias personalizadas
          </p>
        </div>
        <Button onClick={handleOpenCreateModal}>
          <Plus size={18} />
          Nova Categoria
        </Button>
      </div>

      {/* Barra de Filtros e Abas */}
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
            {/* Abas Despesa / Receita */}
            <div
              style={{
                display: 'flex',
                gap: 'var(--spacing-xs)',
                backgroundColor: 'var(--bg-muted)',
                padding: '4px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedType('EXPENSE')}
                style={{
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  backgroundColor: selectedType === 'EXPENSE' ? 'var(--bg-surface)' : 'transparent',
                  color: selectedType === 'EXPENSE' ? 'var(--expense-text)' : 'var(--text-muted)',
                  boxShadow: selectedType === 'EXPENSE' ? 'var(--shadow-sm)' : 'none',
                  transition: 'all var(--transition-fast)',
                }}
              >
                Despesas
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('INCOME')}
                style={{
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  backgroundColor: selectedType === 'INCOME' ? 'var(--bg-surface)' : 'transparent',
                  color: selectedType === 'INCOME' ? 'var(--income-text)' : 'var(--text-muted)',
                  boxShadow: selectedType === 'INCOME' ? 'var(--shadow-sm)' : 'none',
                  transition: 'all var(--transition-fast)',
                }}
              >
                Receitas
              </button>
            </div>

            {/* Campo de Busca com Ícone */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
              <Search
                size={16}
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
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar categoria..."
                style={{
                  width: '100%',
                  paddingLeft: '36px',
                  paddingRight: '12px',
                  minHeight: '38px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-surface)',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Lista de Categorias */}
      {isLoading ? (
        <LoadingState lines={5} />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<Tag size={40} />}
          title="Nenhuma categoria encontrada"
          description={
            searchTerm
              ? 'Nenhuma categoria corresponde à pesquisa.'
              : 'Crie sua primeira categoria para começar.'
          }
          action={
            <Button onClick={handleOpenCreateModal}>
              <Plus size={16} />
              Criar Categoria
            </Button>
          }
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--spacing-md)',
          }}
        >
          {categories.map(cat => (
            <Card key={cat.id}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: cat.color ? `${cat.color}20` : 'var(--bg-muted)',
                      color: cat.color || 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Tag size={18} />
                  </div>
                  <div>
                    <h4
                      style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)' }}
                    >
                      {cat.name}
                    </h4>
                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)', marginTop: '2px' }}>
                      {cat.is_system ? (
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                          Padrão do Sistema
                        </span>
                      ) : (
                        <Badge variant="neutral">Personalizada</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {!cat.is_system && (
                  <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(cat)}
                      style={{
                        padding: '6px',
                        color: 'var(--text-muted)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                      title="Editar Categoria"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id)}
                      style={{ padding: '6px', color: '#ef4444', borderRadius: 'var(--radius-sm)' }}
                      title="Excluir Categoria"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Criação / Edição */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        categoryToEdit={categoryToEdit}
        defaultType={selectedType}
      />
    </div>
  );
};
