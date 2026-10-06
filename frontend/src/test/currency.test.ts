import { describe, it, expect } from 'vitest';
import { formatCurrency, parseCurrencyInput } from '@/utils/currency';

describe('Currency Utility', () => {
  it('formats positive numbers to BRL currency format', () => {
    const formatted = formatCurrency(1234.56);
    expect(formatted).toContain('1.234,56');
    expect(formatted).toContain('R$');
  });

  it('handles zero and empty inputs gracefully', () => {
    expect(formatCurrency(0)).toContain('0,00');
    expect(formatCurrency(null)).toContain('0,00');
    expect(formatCurrency(undefined)).toContain('0,00');
  });

  it('parses formatted input string into accurate numeric value', () => {
    expect(parseCurrencyInput('R$ 1.500,50')).toBe(1500.5);
    expect(parseCurrencyInput('')).toBe(0);
  });
});
