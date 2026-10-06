import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { notificationsService } from '@/features/notifications/services/notifications.service';

vi.mock('@/features/notifications/services/notifications.service', () => ({
  notificationsService: {
    getSummary: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
  },
}));

describe('NotificationBell Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();

    vi.mocked(notificationsService.getSummary).mockResolvedValue({
      alerts: [
        {
          id: 'tx-overdue-1',
          source: 'transaction',
          type: 'DANGER',
          title: 'Conta de Energia Vencida',
          message: 'Vencida em 01/10/2026 no valor de R$ 350,00',
          date: '2026-10-01',
          is_urgent: true,
          transaction_id: 1,
        },
      ],
      notifications: [
        {
          id: 10,
          source: 'system',
          type: 'INFO',
          title: 'Senha alterada',
          message: 'Sua senha foi atualizada recentemente.',
          data: null,
          read_at: null,
          created_at: '2026-10-05T12:00:00Z',
        },
      ],
      unread_count: 2,
    });
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <NotificationBell />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders bell button with unread count badge', async () => {
    renderComponent();

    const badge = await screen.findByText('2');
    expect(badge).toBeDefined();
  });

  it('opens notification dropdown on click', async () => {
    renderComponent();

    const bellBtn = screen.getByRole('button', { name: /Notificações/i });
    fireEvent.click(bellBtn);

    expect(await screen.findByText('Alertas e Notificações')).toBeDefined();
    expect(await screen.findByText('Conta de Energia Vencida')).toBeDefined();
    expect(await screen.findByText('Senha alterada')).toBeDefined();
  });
});
