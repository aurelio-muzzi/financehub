import { AxiosError } from 'axios';
import type { ApiError } from '@/types/api';

export class AppError extends Error {
  public errors?: Record<string, string[]>;
  public statusCode?: number;

  constructor(message: string, statusCode?: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export function handleAxiosError(error: unknown): AppError {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError | undefined;
    const message =
      data?.message || error.message || 'Erro inesperado ao comunicar com o servidor.';
    return new AppError(message, error.response?.status, data?.errors);
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError('Ocorreu um erro desconhecido.');
}
