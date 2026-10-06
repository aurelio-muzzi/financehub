import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';
import { settingsService } from '@/features/settings/services/settings.service';

vi.mock('@/features/settings/services/settings.service', () => ({
  settingsService: {
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    updatePreferences: vi.fn(),
  },
}));

describe('SettingsPage Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();

    vi.mocked(settingsService.getProfile).mockResolvedValue({
      id: 1,
      name: 'João Financeiro',
      email: 'joao@financehub.test',
      role_id: 1,
      status: 'ACTIVE',
      role: { id: 1, name: 'admin', label: 'Administrador' },
      preferences: { theme: 'light', currency: 'BRL' },
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    });
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SettingsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders settings page title and tabs', async () => {
    renderComponent();

    expect(screen.getByText('Configurações e Perfil')).toBeDefined();
    expect(screen.getByText('Meu Perfil')).toBeDefined();
    expect(screen.getByText('Segurança')).toBeDefined();
    expect(screen.getByText('Preferências')).toBeDefined();
  });

  it('switches between tabs properly', async () => {
    renderComponent();

    const securityTab = screen.getByText('Segurança');
    fireEvent.click(securityTab);

    expect(screen.getByText('Alteração de Senha')).toBeDefined();
    expect(screen.getByText('Senha Atual')).toBeDefined();

    const preferencesTab = screen.getByText('Preferências');
    fireEvent.click(preferencesTab);

    expect(screen.getByText('Preferências da Conta')).toBeDefined();
    expect(screen.getByText('Moeda Padrão')).toBeDefined();
  });
});
