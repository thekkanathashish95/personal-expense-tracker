import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signInAnonymously, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { userMappingService } from '../services/userMappingService';
import useErrorHandler from '../hooks/useErrorHandler';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  mappedAndroidUid: string | null;
  signInWithGoogle: () => Promise<User>;
  signInAnonymouslyUser: () => Promise<User>;
  signOut: () => Promise<void>;
  setMappedAndroidUid: (uid: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mappedAndroidUid, setMappedAndroidUid] = useState<string | null>(null);
  const { handleAuthError, handleFirebaseError } = useErrorHandler();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user && user.email) {
        try {
          // Check if user has a mapping
          const androidUid = await userMappingService.getAndroidUidForGoogleUser(
            user.email,
            user.uid
          );
          setMappedAndroidUid(androidUid);
        } catch (error) {
          handleFirebaseError(error);
          setMappedAndroidUid(null);
        }
      } else {
        setMappedAndroidUid(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async (): Promise<User> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');

      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  const signInAnonymouslyUser = async (): Promise<User> => {
    try {
      const result = await signInAnonymously(auth);
      return result.user;
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  // Note: Removed auto anonymous sign-in - users must explicitly sign in with Google

  const value = {
    user,
    loading,
    mappedAndroidUid,
    signInWithGoogle,
    signInAnonymouslyUser,
    signOut,
    setMappedAndroidUid
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};