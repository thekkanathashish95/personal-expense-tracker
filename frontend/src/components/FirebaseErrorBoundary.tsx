import { Component, ErrorInfo, ReactNode } from 'react';
import { 
  ExclamationTriangleIcon, 
  WifiIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

interface Props {
  children: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isRetrying: boolean;
}

class FirebaseErrorBoundary extends Component<Props, State> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isRetrying: false
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      isRetrying: false
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Firebase Error Boundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error);
    }

    // Auto-retry for network-related errors
    if (this.isNetworkError(error)) {
      this.scheduleRetry();
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  isNetworkError = (error: Error): boolean => {
    const networkErrorMessages = [
      'network error',
      'connection failed',
      'timeout',
      'offline',
      'unavailable',
      'failed to fetch'
    ];
    
    return networkErrorMessages.some(msg => 
      error.message.toLowerCase().includes(msg)
    );
  };

  scheduleRetry = () => {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }

    this.setState({ isRetrying: true });
    
    this.retryTimeout = setTimeout(() => {
      this.handleRetry();
    }, 3000); // Retry after 3 seconds
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      isRetrying: false
    });
  };

  render() {
    if (this.state.hasError) {
      const isNetworkError = this.state.error && this.isNetworkError(this.state.error);
      
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              isNetworkError ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              {isNetworkError ? (
                <WifiIcon className="h-5 w-5 text-yellow-600" />
              ) : (
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-medium ${
                isNetworkError ? 'text-yellow-800' : 'text-red-800'
              }`}>
                {isNetworkError ? 'Connection Issue' : 'Something went wrong'}
              </h3>
              
              <p className={`text-sm mt-1 ${
                isNetworkError ? 'text-yellow-700' : 'text-red-700'
              }`}>
                {isNetworkError 
                  ? 'Unable to connect to the server. Please check your internet connection.'
                  : 'An error occurred while loading data. Please try again.'
                }
              </p>

              {this.state.isRetrying && (
                <p className="text-xs text-gray-500 mt-2">
                  Retrying automatically in a few seconds...
                </p>
              )}

              <div className="mt-3">
                <button
                  onClick={this.handleRetry}
                  disabled={this.state.isRetrying}
                  className={`inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
                    isNetworkError
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 disabled:opacity-50'
                      : 'bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50'
                  }`}
                >
                  <ArrowPathIcon className={`h-3 w-3 ${this.state.isRetrying ? 'animate-spin' : ''}`} />
                  <span>{this.state.isRetrying ? 'Retrying...' : 'Try Again'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default FirebaseErrorBoundary;
