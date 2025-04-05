import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { DynamicAuthService } from '@/lib/services/dynamicAuth';

export function useAuth() {
  const { user, primaryWallet, handleLogOut } = useDynamicContext();
  const [loading, setLoading] = useState(true);
  const authService = DynamicAuthService.getInstance();

  const isAuthenticated = !!user && !!primaryWallet;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        // Additional auth checks can be added here
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, primaryWallet]);

  const login = async () => {
    // Dynamic handles the login flow through their widget
    // We just need to handle the post-login success in the DynamicAuthProvider
  };

  const logout = async () => {
    try {
      await handleLogOut();
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };
} 