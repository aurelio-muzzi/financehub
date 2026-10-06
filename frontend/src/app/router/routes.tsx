import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/app/layouts/AppLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { GuestRoute } from '@/app/router/GuestRoute';
import { AdminRoute } from '@/app/router/AdminRoute';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { SecuritySettingsPage } from '@/features/settings/pages/SecuritySettingsPage';
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage';
import { AccountsPage } from '@/features/accounts/pages/AccountsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas Públicas para Visitantes (Guest) */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>

      {/* Rotas Protegidas Autenticadas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<DashboardPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/reports" element={<DashboardPage />} />
          <Route path="/settings/profile" element={<SecuritySettingsPage />} />
          <Route path="/settings/security" element={<SecuritySettingsPage />} />

          {/* Área Administrativa com RBAC */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/users" element={<DashboardPage />} />
            <Route path="/admin/audit-logs" element={<DashboardPage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback padrão */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
