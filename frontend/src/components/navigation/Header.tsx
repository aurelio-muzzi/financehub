import React from 'react';
import { Menu, Bell, User as UserIcon } from 'lucide-react';
import { useUiStore } from '@/stores/useUiStore';
import styles from './Header.module.css';

export interface HeaderProps {
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({ userName = 'Usuário' }) => {
  const toggleMobileMenu = useUiStore(state => state.toggleMobileMenu);

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
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
};
