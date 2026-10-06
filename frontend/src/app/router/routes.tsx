import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/app/layouts/AppLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { GuestRoute } from '@/app/router/GuestRoute';
import { AdminRoute } from '@/app/router/AdminRoute';
import { LoadingState } from '@/components/feedback/LoadingState';

// Lazy loading das páginas para otimização de bundle e code splitting
const DashboardPage = React.lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage }))
);
const LoginPage = React.lazy(() =>
  import('@/features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage }))
);
const ForgotPasswordPage = React.lazy(() =>
  import('@/features/auth/pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage }))
);
const ResetPasswordPage = React.lazy(() =>
  import('@/features/auth/pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage }))
);
const SettingsPage = React.lazy(() =>
  import('@/features/settings/pages/SettingsPage').then(m => ({ default: m.SettingsPage }))
);
const AdminUsersPage = React.lazy(() =>
  import('@/features/admin/pages/AdminUsersPage').then(m => ({ default: m.AdminUsersPage }))
);
const AdminAuditPage = React.lazy(() =>
  import('@/features/admin/pages/AdminAuditPage').then(m => ({ default: m.AdminAuditPage }))
);
const CategoriesPage = React.lazy(() =>
  import('@/features/categories/pages/CategoriesPage').then(m => ({ default: m.CategoriesPage }))
);
const AccountsPage = React.lazy(() =>
  import('@/features/accounts/pages/AccountsPage').then(m => ({ default: m.AccountsPage }))
);
const TransactionsPage = React.lazy(() =>
  import('@/features/transactions/pages/TransactionsPage').then(m => ({
    default: m.TransactionsPage,
  }))
);
const ReportsPage = React.lazy(() =>
  import('@/features/reports/pages/ReportsPage').then(m => ({ default: m.ReportsPage }))
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 'var(--spacing-xl)', maxWidth: '1200px', margin: '0 auto' }}>
          <LoadingState lines={5} />
        </div>
      }
    >
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
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/profile" element={<SettingsPage />} />
            <Route path="/settings/security" element={<SettingsPage />} />

            {/* Área Administrativa com RBAC */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/audit-logs" element={<AdminAuditPage />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback padrão */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};
