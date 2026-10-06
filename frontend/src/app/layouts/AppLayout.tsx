import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/navigation/Header';
import { Sidebar } from '@/components/navigation/Sidebar';
import { MobileNav } from '@/components/navigation/MobileNav';

export const AppLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <MobileNav />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main
          style={{
            flex: 1,
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--bg-app)',
            maxWidth: '100%',
          }}
        >
          <div className="container-app">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
