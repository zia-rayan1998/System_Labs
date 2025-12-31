import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, User, getToken } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const token = getToken();
    if (token) {
      authAPI.getCurrentUser()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          // Token invalid, clear it
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await authAPI.login(email, password);
      setUser(result.user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      // Re-throw to let AuthPage handle the error message
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const result = await authAPI.signup(email, password, username);
      setUser(result.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const updatedUser = await authAPI.getCurrentUser();
      setUser(updatedUser);
    } catch (error) {
      console.error('Refresh user error:', error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
