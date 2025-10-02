import { useCallback } from 'react';
import toast from 'react-hot-toast';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: unknown, 
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logError = true,
      fallbackMessage = 'An unexpected error occurred'
    } = options;

    // Extract error message
    let errorMessage = fallbackMessage;
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }

    // Log error for debugging
    if (logError) {
      console.error('Error handled by useErrorHandler:', error);
    }

    // Show toast notification
    if (showToast) {
      toast.error(errorMessage);
    }

    return errorMessage;
  }, []);

  const handleFirebaseError = useCallback((error: unknown) => {
    let userMessage = 'A database error occurred';

    if (error instanceof Error) {
      // Handle specific Firebase error codes
      if (error.message.includes('permission-denied')) {
        userMessage = 'You don\'t have permission to perform this action';
      } else if (error.message.includes('not-found')) {
        userMessage = 'The requested data was not found';
      } else if (error.message.includes('already-exists')) {
        userMessage = 'This item already exists';
      } else if (error.message.includes('unavailable')) {
        userMessage = 'Service is temporarily unavailable. Please try again.';
      } else if (error.message.includes('network')) {
        userMessage = 'Network error. Please check your connection.';
      } else {
        userMessage = error.message;
      }
    }

    handleError(userMessage, {
      showToast: true,
      logError: true
    });

    return userMessage;
  }, [handleError]);

  const handleAuthError = useCallback((error: unknown) => {
    let userMessage = 'Authentication failed';

    if (error instanceof Error) {
      if (error.message.includes('auth/popup-closed-by-user')) {
        userMessage = 'Sign-in was cancelled';
      } else if (error.message.includes('auth/network-request-failed')) {
        userMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('auth/too-many-requests')) {
        userMessage = 'Too many attempts. Please try again later.';
      } else if (error.message.includes('auth/user-disabled')) {
        userMessage = 'This account has been disabled';
      } else {
        userMessage = 'Authentication error. Please try again.';
      }
    }

    handleError(userMessage, {
      showToast: true,
      logError: true
    });

    return userMessage;
  }, [handleError]);

  return {
    handleError,
    handleFirebaseError,
    handleAuthError
  };
};

export default useErrorHandler;
