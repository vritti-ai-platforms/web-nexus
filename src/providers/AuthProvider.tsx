import { useQueryClient } from '@tanstack/react-query';
import { clearToken } from '@vritti/quantum-ui/axios';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { useUser } from '../hooks';
import type { User } from '../services';

/**
 * Authentication context value interface
 */
interface AuthContextValue {
  /** Current authenticated user data, undefined if not authenticated */
  user: User | undefined;
  /** Whether the authentication state is being loaded */
  isLoading: boolean;
  /** Whether the user is authenticated (has valid token and user data) */
  isAuthenticated: boolean;
  /** Function to logout and clear all auth state */
  logout: () => void;
}

/**
 * Auth context with default values
 */
const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  isLoading: true,
  isAuthenticated: false,
  logout: () => {},
});

/**
 * AuthProvider component that provides authentication context
 *
 * This provider:
 * - Fetches auth status on mount via useUser hook
 * - Derives authentication state from API response
 * - Provides auth context to child components
 *
 * Note: After login/logout, do a full page reload to '/' to refresh auth state.
 *
 * @example
 * ```tsx
 * // In App.tsx
 * <QueryClientProvider client={queryClient}>
 *   <BrowserRouter>
 *     <AuthProvider>
 *       <AppRender />
 *     </AuthProvider>
 *   </BrowserRouter>
 * </QueryClientProvider>
 * ```
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Fetch auth status on mount
  const { data: authStatus, isLoading } = useUser();

  /**
   * Logout function that clears token and query cache
   * Note: Caller should reload page to '/' after calling this
   */
  const logout = useCallback(() => {
    clearToken();
    queryClient.clear();
  }, [queryClient]);

  // Derive state from API response
  const isAuthenticated = authStatus?.isAuthenticated ?? false;
  const user = authStatus?.user;

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      logout,
    }),
    [user, isLoading, isAuthenticated, logout],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access authentication context
 *
 * @returns AuthContextValue containing user data, auth state, and auth functions
 * @throws Error if used outside of AuthProvider
 *
 * @example
 * ```tsx
 * function UserProfile() {
 *   const { user, isAuthenticated, isLoading, logout } = useAuth();
 *
 *   if (isLoading) return <Spinner />;
 *   if (!isAuthenticated) return null;
 *
 *   return (
 *     <div>
 *       <p>Welcome, {user?.firstName}!</p>
 *       <button onClick={() => { logout(); window.location.href = '/'; }}>
 *         Sign out
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
