import { useQueryClient } from '@tanstack/react-query';
import { clearToken, scheduleTokenRefresh, setToken } from '@vritti/quantum-ui/axios';
import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useUser } from '../hooks';
import type { User } from '../services';

interface AuthContextValue {
  user: User | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  isLoading: true,
  isAuthenticated: false,
  logout: () => {},
});

// Provides auth state to the app — after login/logout, reload the page to refresh
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { data: authStatus, isLoading } = useUser();

  // Store access token in memory and schedule proactive refresh
  useEffect(() => {
    if (authStatus?.isAuthenticated && authStatus.accessToken && authStatus.expiresIn) {
      setToken(authStatus.accessToken);
      scheduleTokenRefresh(authStatus.expiresIn);
    }
  }, [authStatus]);

  // Caller should reload page to '/' after calling logout
  const logout = useCallback(() => {
    clearToken();
    queryClient.clear();
  }, [queryClient]);

  const isAuthenticated = authStatus?.isAuthenticated ?? false;
  const user = authStatus?.user;

  const contextValue = useMemo<AuthContextValue>(
    () => ({ user, isLoading, isAuthenticated, logout }),
    [user, isLoading, isAuthenticated, logout],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Hook to access auth state — must be used within AuthProvider
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
