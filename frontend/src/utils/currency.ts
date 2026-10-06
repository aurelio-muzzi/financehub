/**
 * Formata um valor numérico para Moeda Brasileira (BRL).
 * Exemplo: 1234.56 -> "R$ 1.234,56"
 */
export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return 'R$ 0,00';
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) {
    return 'R$ 0,00';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Converte string digitada para valor numérico seguro.
 */
export function parseCurrencyInput(value: string): number {
  const clean = value.replace(/[^\d]/g, '');
  if (!clean) return 0;
  return parseFloat(clean) / 100;
}
