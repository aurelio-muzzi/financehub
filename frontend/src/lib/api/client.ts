import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
  withXSRFToken: true,
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    // Se receber 401 ou 419 (CSRF token expired), podemos tratar de forma limpa
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      // Deixar o AuthProvider gerenciar ou redirecionar
    }
    return Promise.reject(error);
  }
);
