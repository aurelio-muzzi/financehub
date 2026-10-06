import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Tag,
  BarChart3,
  Settings,
  ShieldCheck,
  History,
} from 'lucide-react';
import { useUiStore } from '@/stores/useUiStore';

export interface MobileNavProps {
  isAdmin?: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isAdmin = false }) => {
  const isMobileMenuOpen = useUiStore(state => state.isMobileMenuOpen);
  const setMobileMenuOpen = useUiStore(state => state.setMobileMenuOpen);

  if (!isMobileMenuOpen) return null;

  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Transações', to: '/transactions', icon: <ArrowLeftRight size={20} /> },
    { label: 'Contas', to: '/accounts', icon: <Wallet size={20} /> },
    { label: 'Categorias', to: '/categories', icon: <Tag size={20} /> },
    { label: 'Relatórios', to: '/reports', icon: <BarChart3 size={20} /> },
    { label: 'Configurações', to: '/settings', icon: <Settings size={20} /> },
    {
      label: 'Usuários (RBAC)',
      to: '/admin/users',
      icon: <ShieldCheck size={20} />,
      isAdmin: true,
    },
    { label: 'Auditoria', to: '/admin/audit-logs', icon: <History size={20} />, isAdmin: true },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'relative',
          width: '80%',
          maxWidth: '300px',
          backgroundColor: 'var(--bg-surface)',
          height: '100%',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          padding: 'var(--spacing-md)',
          animation: 'fadeIn 150ms ease-out',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-lg)',
          }}
        >
          <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary-700)' }}>
            FinanceHub
          </span>
          <button
            type="button"
            style={{
              minWidth: 'var(--min-touch-size)',
              minHeight: 'var(--min-touch-size)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
          {navItems
            .filter(item => !item.isAdmin || (item.isAdmin && isAdmin))
            .map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  minHeight: 'var(--min-touch-size)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive ? 'var(--primary-700)' : 'var(--text-main)',
                  backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
                })}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
        </nav>
      </div>
    </div>
  );
};
