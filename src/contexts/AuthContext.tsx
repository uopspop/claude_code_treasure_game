import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authService, type AuthUser, type SignUpData, type SignInData } from '../services/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  signIn: (data: SignInData) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  signOut: () => void;
  saveGameScore: (score: number, treasureFound: boolean) => Promise<void>;
  getUserScores: () => Promise<any[]>;
  getUserBestScore: () => Promise<number>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Provides authentication state and methods to the entire app
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await authService.init();
        
        // Subscribe to auth state changes
        const unsubscribe = authService.onAuthStateChange((newUser) => {
          setUser(newUser);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Sign up new user
  const signUp = async (data: SignUpData) => {
    return await authService.signUp(data);
  };

  // Sign in existing user
  const signIn = async (data: SignInData) => {
    return await authService.signIn(data);
  };

  // Sign out current user
  const signOut = () => {
    authService.signOut();
  };

  // Save game score for current user
  const saveGameScore = async (score: number, treasureFound: boolean) => {
    try {
      await authService.saveGameScore(score, treasureFound);
    } catch (error) {
      console.error('Error saving game score:', error);
    }
  };

  // Get current user's scores
  const getUserScores = async () => {
    try {
      return await authService.getUserScores();
    } catch (error) {
      console.error('Error getting user scores:', error);
      return [];
    }
  };

  // Get current user's best score
  const getUserBestScore = async () => {
    try {
      return await authService.getUserBestScore();
    } catch (error) {
      console.error('Error getting best score:', error);
      return 0;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: user !== null,
    signUp,
    signIn,
    signOut,
    saveGameScore,
    getUserScores,
    getUserBestScore,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the authentication context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}