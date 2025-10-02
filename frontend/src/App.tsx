import React, { ErrorInfo } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoginScreen from './components/LoginScreen';
import UserMappingSetup from './components/UserMappingSetup';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

const AppContent: React.FC = () => {
  const { user, loading, mappedAndroidUid, setMappedAndroidUid } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <LoginScreen onLoginSuccess={() => {}} />;
  }

  // Show user mapping setup if authenticated but no mapping exists
  if (user && user.email && !mappedAndroidUid) {
    return (
      <UserMappingSetup
        googleEmail={user.email}
        googleUid={user.uid}
        onMappingComplete={(androidUid) => {
          setMappedAndroidUid(androidUid);
        }}
        onSkip={() => {
          // User can skip and use the app without their Android data
          setMappedAndroidUid('skipped');
        }}
      />
    );
  }

  // Show main app if authenticated and mapping is complete
  return <Layout />;
};

const App: React.FC = () => {
  const handleAppError = (error: Error, errorInfo: ErrorInfo) => {
    // Log critical app errors
    console.error('Critical app error:', error, errorInfo);
    
    // You could send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  };

  return (
    <ErrorBoundary onError={handleAppError}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 2000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;