import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/Button/Button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Clique Aqui</Button>);
    expect(screen.getByRole('button', { name: /clique aqui/i })).toBeInTheDocument();
  });

  it('triggers onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Ação</Button>);

    await userEvent.click(screen.getByRole('button', { name: /ação/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and shows loading text when isLoading is true', () => {
    render(<Button isLoading>Salvar</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText(/carregando.../i)).toBeInTheDocument();
  });
});
