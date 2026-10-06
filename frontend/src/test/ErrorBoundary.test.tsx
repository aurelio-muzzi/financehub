import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';

// Componente auxiliar que força um lançamento de erro
const ProblematicChild: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Simulated crash error');
  }
  return <div>Conteúdo normal carregado com sucesso</div>;
};

describe('ErrorBoundary Component', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    // Suprime mensagens de console.error geradas deliberadamente pelo lançamento de erro no React
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('renders children normally when there is no error', () => {
    render(
      <ErrorBoundary>
        <ProblematicChild shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Conteúdo normal carregado com sucesso')).toBeInTheDocument();
  });

  it('renders standard error fallback UI when an uncaught error is thrown', () => {
    render(
      <ErrorBoundary>
        <ProblematicChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Ocorreu um erro inesperado')).toBeInTheDocument();
    expect(screen.getByText(/Nossa equipe foi notificada sobre a falha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /recarregar aplicação/i })).toBeInTheDocument();
  });

  it('renders custom fallback prop when provided and error occurs', () => {
    render(
      <ErrorBoundary fallback={<div>Fallback customizado para teste</div>}>
        <ProblematicChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Fallback customizado para teste')).toBeInTheDocument();
    expect(screen.queryByText('Ocorreu um erro inesperado')).not.toBeInTheDocument();
  });

  it('handles reload button click when error fallback is rendered', async () => {
    // Mock do window.location.reload
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: reloadMock },
    });

    render(
      <ErrorBoundary>
        <ProblematicChild shouldThrow={true} />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByRole('button', { name: /recarregar aplicação/i });
    await userEvent.click(reloadButton);

    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});
