import React, { Suspense, lazy } from 'react';
import Header from './Header';
import { useActiveTab, useSetActiveTab } from '../store';
import FirebaseErrorBoundary from './FirebaseErrorBoundary';
import LoadingSpinner from './LoadingSpinner';

// Lazy load main components for better performance
const Dashboard = lazy(() => import('./Dashboard'));
const ExpensesList = lazy(() => import('./ExpensesList'));

const Layout: React.FC = () => {
  const activeTab = useActiveTab();
  const setActiveTab = useSetActiveTab();

  const renderContent = (): React.ReactElement => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'expenses':
        return <ExpensesList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FirebaseErrorBoundary>
          <Suspense fallback={
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="large" />
            </div>
          }>
            {renderContent()}
          </Suspense>
        </FirebaseErrorBoundary>
      </main>
    </div>
  );
};

export default Layout;
