import React from 'react';
import { AppProviders } from '@/app/providers/AppProviders';
import { AppRoutes } from '@/app/router/routes';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import '@/styles/global.css';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;
