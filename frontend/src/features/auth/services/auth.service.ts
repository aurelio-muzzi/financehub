import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/user';
import type {
  LoginCredentials,
  UpdatePasswordData,
  ForgotPasswordData,
  ResetPasswordData,
} from '../types/auth.types';

export const authService = {
  /**
   * Inicializa o cookie de proteção CSRF antes de mutações de sessão.
   */
  async getCsrfCookie(): Promise<void> {
    await apiClient.get('/sanctum/csrf-cookie');
  },

  /**
   * Efetua login com credenciais e estabelece sessão.
   */
  async login(credentials: LoginCredentials): Promise<User> {
    await this.getCsrfCookie();
    const response = await apiClient.post<ApiResponse<User>>('/api/v1/auth/login', credentials);
    return response.data.data;
  },

  /**
   * Encerra a sessão no backend.
   */
  async logout(): Promise<void> {
    await apiClient.post<ApiResponse<null>>('/api/v1/auth/logout');
  },

  /**
   * Obtém os dados do usuário autenticado atual.
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/api/v1/auth/me');
    return response.data.data;
  },

  /**
   * Solicita link/token de recuperação de senha.
   */
  async forgotPassword(data: ForgotPasswordData): Promise<string> {
    await this.getCsrfCookie();
    const response = await apiClient.post<ApiResponse<null>>('/api/v1/auth/forgot-password', data);
    return response.data.message || 'Instruções enviadas.';
  },

  /**
   * Redefine a senha com o token recebido.
   */
  async resetPassword(data: ResetPasswordData): Promise<string> {
    await this.getCsrfCookie();
    const response = await apiClient.post<ApiResponse<null>>('/api/v1/auth/reset-password', data);
    return response.data.message || 'Senha redefinida com sucesso.';
  },

  /**
   * Altera a senha do usuário autenticado.
   */
  async updatePassword(data: UpdatePasswordData): Promise<string> {
    const response = await apiClient.put<ApiResponse<null>>('/api/v1/auth/password', data);
    return response.data.message || 'Senha alterada com sucesso.';
  },
};
