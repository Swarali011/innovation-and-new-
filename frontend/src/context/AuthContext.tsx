import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => Promise<void>;
  logout: () => void;
  updateApiKey: (apiKey: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('innovation_ai_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr-default',
      email: 'prachi.swarali@dypatil.edu',
      displayName: 'Prachi & Swarali',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      geminiApiKey: ''
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('innovation_ai_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('innovation_ai_user');
    }
  }, [user]);

  const login = async (email: string, name?: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email,
      displayName: name || email.split('@')[0],
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateApiKey = (apiKey: string) => {
    if (user) {
      setUser({ ...user, geminiApiKey: apiKey });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateApiKey }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
