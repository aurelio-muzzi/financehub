import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Tag,
  BarChart3,
  Settings,
  ShieldCheck,
  History,
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface NavItemConfig {
  label: string;
  to: string;
  icon: React.ReactNode;
  isAdmin?: boolean;
}

const navItems: NavItemConfig[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Transações', to: '/transactions', icon: <ArrowLeftRight size={18} /> },
  { label: 'Contas', to: '/accounts', icon: <Wallet size={18} /> },
  { label: 'Categorias', to: '/categories', icon: <Tag size={18} /> },
  { label: 'Relatórios', to: '/reports', icon: <BarChart3 size={18} /> },
  { label: 'Configurações', to: '/settings', icon: <Settings size={18} /> },
  { label: 'Usuários (RBAC)', to: '/admin/users', icon: <ShieldCheck size={18} />, isAdmin: true },
  { label: 'Auditoria', to: '/admin/audit-logs', icon: <History size={18} />, isAdmin: true },
];

export interface SidebarProps {
  isAdmin?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false }) => {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {navItems
          .filter(item => !item.isAdmin || (item.isAdmin && isAdmin))
          .map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
      </nav>
    </aside>
  );
};
