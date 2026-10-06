import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AdminAuditPage } from '@/features/admin/pages/AdminAuditPage';
import { adminService } from '@/features/admin/services/admin.service';

vi.mock('@/features/admin/services/admin.service', () => ({
  adminService: {
    getAuditLogs: vi.fn(),
  },
}));

describe('AdminAuditPage Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();

    vi.mocked(adminService.getAuditLogs).mockResolvedValue({
      success: true,
      message: null,
      data: [
        {
          id: 1,
          action: 'TRANSACTION_CREATE',
          entity_type: 'Transaction',
          entity_id: 101,
          old_values: null,
          new_values: { amount: 150.0, description: 'Supermercado' },
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0 Chrome',
          created_at: '2026-10-05T14:30:00Z',
          user: { id: 1, name: 'Admin Teste', email: 'admin@financehub.test' },
        },
      ],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 1,
      },
    });
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminAuditPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders audit page title and logs table', async () => {
    renderComponent();

    expect(await screen.findByText('Logs de Auditoria e Rastreabilidade')).toBeDefined();
    expect(await screen.findByText('TRANSACTION_CREATE')).toBeDefined();
    expect(screen.getByText(/Transaction #101/i)).toBeDefined();
    expect(screen.getByText('Admin Teste')).toBeDefined();
  });

  it('opens diff modal when clicking inspect button', async () => {
    renderComponent();

    const inspectBtn = await screen.findByRole('button', { name: /Ver Diff/i });
    fireEvent.click(inspectBtn);

    expect(await screen.findByText(/Detalhes da Auditoria #1/i)).toBeDefined();
    expect(screen.getByText('Valores Anteriores (Old)')).toBeDefined();
    expect(screen.getByText('Novos Valores (New)')).toBeDefined();
  });
});
