'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthModal } from './AuthModal';
import { toast } from 'sonner';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: (onSuccess?: () => void) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('goorita_user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const [isReady, setIsReady] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsReady(true);
  }, []);

  const login = (email: string, name: string) => {
    const newUser = { email, name };
    setUser(newUser);
    localStorage.setItem('goorita_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('goorita_user');
    toast('You have been logged out.');
  };

  const openAuthModal = (onSuccess?: () => void) => {
    if (onSuccess) setOnSuccessCallback(() => onSuccess);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setOnSuccessCallback(null);
  };

  const handleAuthSuccess = () => {
    if (onSuccessCallback) {
      onSuccessCallback();
    }
    closeAuthModal();
  };

  if (!isReady) return null;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, isAuthModalOpen, openAuthModal, closeAuthModal }}>
      {children}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        onSuccess={handleAuthSuccess} 
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
