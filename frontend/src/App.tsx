import React from 'react';
import { AppProviders } from '@/app/providers/AppProviders';
import { AppRoutes } from '@/app/router/routes';
import '@/styles/global.css';

export const App: React.FC = () => {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};

export default App;
