import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockAuth, User } from '@/lib/mockData';

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
    const storedUser = mockAuth.getCurrentUser();
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await mockAuth.login(email, password);
      if (result) {
        setUser(result);
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const result = await mockAuth.signup(email, password, username);
      if (result) {
        setUser(result);
        return { success: true };
      }
      return { success: false, error: 'Signup failed' };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    mockAuth.logout();
    setUser(null);
  };

  const refreshUser = () => {
    const updatedUser = mockAuth.getCurrentUser();
    setUser(updatedUser);
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
