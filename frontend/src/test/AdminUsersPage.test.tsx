import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AdminUsersPage } from '@/features/admin/pages/AdminUsersPage';
import { adminService } from '@/features/admin/services/admin.service';

vi.mock('@/features/admin/services/admin.service', () => ({
  adminService: {
    getUsers: vi.fn(),
    getRoles: vi.fn(),
    updateUser: vi.fn(),
  },
}));

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Super Admin', role: { name: 'admin' } },
    isAuthenticated: true,
    isAdmin: true,
    isLoading: false,
  }),
}));

describe('AdminUsersPage Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();

    vi.mocked(adminService.getRoles).mockResolvedValue([
      { id: 1, name: 'admin', label: 'Administrador' },
      { id: 2, name: 'user', label: 'Usuário Padrão' },
    ]);

    vi.mocked(adminService.getUsers).mockResolvedValue({
      success: true,
      message: null,
      data: [
        {
          id: 1,
          name: 'Super Admin',
          email: 'admin@financehub.test',
          role_id: 1,
          role: { id: 1, name: 'admin', label: 'Administrador' },
          status: 'ACTIVE',
          accounts_count: 3,
          transactions_count: 45,
          created_at: '2026-01-01T00:00:00Z',
        },
        {
          id: 2,
          name: 'Usuário Inativo',
          email: 'inativo@financehub.test',
          role_id: 2,
          role: { id: 2, name: 'user', label: 'Usuário Padrão' },
          status: 'INACTIVE',
          accounts_count: 1,
          transactions_count: 5,
          created_at: '2026-02-01T00:00:00Z',
        },
      ],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 2,
      },
    });
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders admin users table with data', async () => {
    renderComponent();

    expect(await screen.findByText('Gerenciamento de Usuários e RBAC')).toBeDefined();
    expect(await screen.findByText('Super Admin')).toBeDefined();
    expect(screen.getByText('admin@financehub.test')).toBeDefined();
    expect(screen.getByText('Usuário Inativo')).toBeDefined();
    expect(screen.getByText('ATIVO')).toBeDefined();
    expect(screen.getByText('INATIVO')).toBeDefined();
  });

  it('opens edit modal when clicking edit button', async () => {
    renderComponent();

    const editButtons = await screen.findAllByRole('button', { name: /Editar/i });
    expect(editButtons.length).toBeGreaterThan(0);
    fireEvent.click(editButtons[0]);

    expect(await screen.findByText(/Editar Usuário: Super Admin/i)).toBeDefined();
    expect(screen.getByText('Papel de Acesso (RBAC)')).toBeDefined();
  });
});
