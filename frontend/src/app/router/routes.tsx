import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/app/layouts/AppLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas Públicas de Autenticação */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Rotas Autenticadas da Aplicação */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<DashboardPage />} />
        <Route path="/accounts" element={<DashboardPage />} />
        <Route path="/categories" element={<DashboardPage />} />
        <Route path="/reports" element={<DashboardPage />} />
        <Route path="/settings/profile" element={<DashboardPage />} />
        <Route path="/admin/users" element={<DashboardPage />} />
      </Route>

      {/* Fallback padrão */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
