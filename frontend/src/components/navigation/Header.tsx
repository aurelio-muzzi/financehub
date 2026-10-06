import React from 'react';
import { Menu, Bell, User as UserIcon, LogOut } from 'lucide-react';
import { useUiStore } from '@/stores/useUiStore';
import { useAuth } from '@/features/auth/hooks/useAuth';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const toggleMobileMenu = useUiStore(state => state.toggleMobileMenu);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Ignorar e deixar redirecionar
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={toggleMobileMenu}
          aria-label="Abrir menu de navegação"
        >
          <Menu size={22} />
        </button>
        <span className={styles.title}>FinanceHub</span>
      </div>

      <div className={styles.rightSection}>
        <button
          type="button"
          style={{
            minWidth: '40px',
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            borderRadius: 'var(--radius-full)',
          }}
          aria-label="Notificações"
        >
          <Bell size={20} />
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            fontSize: '0.875rem',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-100)',
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UserIcon size={16} />
          </div>
          <span style={{ fontWeight: 500 }} className="hide-on-mobile">
            {user?.name || 'Usuário'}
          </span>
          {user?.role && (
            <span
              style={{
                fontSize: '0.6875rem',
                padding: '2px 6px',
                backgroundColor: user.role.name === 'admin' ? '#fef3c7' : 'var(--bg-muted)',
                color: user.role.name === 'admin' ? '#b45309' : 'var(--text-muted)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
              className="hide-on-mobile"
            >
              {user.role.name}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            minWidth: '36px',
            minHeight: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            borderRadius: 'var(--radius-md)',
            transition: 'color var(--transition-fast)',
          }}
          aria-label="Sair da conta"
          title="Sair"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};
