import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { onAuthStateChanged } from 'firebase/auth';

// Mock Firebase Auth
const mockOnAuthStateChanged = onAuthStateChanged as jest.MockedFunction<typeof onAuthStateChanged>;

// Test component that uses the auth context
const TestComponent = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (user) return <div>User: {user.email}</div>;
  return <div>No user</div>;
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      // Don't call callback immediately to test loading state
      return jest.fn(); // unsubscribe function
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows user when authenticated', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      isAnonymous: false,
    };

    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      // Simulate auth state change
      setTimeout(() => callback(mockUser as any), 0);
      return jest.fn(); // unsubscribe function
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('User: test@example.com')).toBeInTheDocument();
    });
  });

  it('shows no user when not authenticated', async () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      // Simulate no user
      setTimeout(() => callback(null), 0);
      return jest.fn(); // unsubscribe function
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No user')).toBeInTheDocument();
    });
  });
});
