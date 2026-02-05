import { type UseMutationOptions, type UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { scheduleTokenRefresh, setToken } from '@vritti/quantum-ui/axios';
import { getCurrentUser, logout, logoutAll, type AuthStatusResponse } from '../services';

/**
 * Options for useUser hook
 */
type UseUserOptions = Omit<UseQueryOptions<AuthStatusResponse, Error>, 'queryKey' | 'queryFn'>;

/**
 * Hook to fetch and manage the current user's authentication status
 *
 * Always fetches auth status on mount (no token check needed).
 * Automatically sets token in memory when authenticated.
 * Provides loading, error, and refetch capabilities.
 *
 * @param options - Optional React Query configuration options
 * @returns Object containing auth status, loading state, error, and refetch function
 *
 * @example
 * ```typescript
 * function UserProfile() {
 *   const { data: authStatus, isLoading, error, refetch } = useUser();
 *
 *   if (isLoading) return <Spinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   if (!authStatus?.isAuthenticated) return <LoginPrompt />;
 *
 *   return (
 *     <div>
 *       <h1>Welcome, {authStatus.user?.firstName}!</h1>
 *       <p>{authStatus.user?.email}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const useUser = (options?: UseUserOptions) => {
  return useQuery<AuthStatusResponse, Error>({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const response = await getCurrentUser();

      // Set token in memory if authenticated
      if (response.isAuthenticated && response.accessToken && response.expiresIn) {
        setToken(response.accessToken);
        scheduleTokenRefresh(response.expiresIn);
      }

      return response;
    },
    staleTime: Infinity, // Don't auto-refetch - auth state is managed explicitly
    retry: false,
    ...options,
  });
};

/**
 * Options for useLogout hook
 */
type UseLogoutOptions = Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>;

/**
 * Hook to logout the current user from the current device
 *
 * @param options - Optional mutation configuration options
 * @returns Mutation object with mutate, isLoading, error, etc.
 *
 * @example
 * ```typescript
 * function LogoutButton() {
 *   const logoutMutation = useLogout({
 *     onSuccess: () => {
 *       clearToken();
 *       window.location.href = '/login';
 *     },
 *   });
 *
 *   return (
 *     <button
 *       onClick={() => logoutMutation.mutate()}
 *       disabled={logoutMutation.isLoading}
 *     >
 *       {logoutMutation.isLoading ? 'Logging out...' : 'Logout'}
 *     </button>
 *   );
 * }
 * ```
 */
export const useLogout = (options?: UseLogoutOptions) => {
  return useMutation<void, Error, void>({
    mutationFn: logout,
    ...options,
  });
};

/**
 * Options for useLogoutAll hook
 */
type UseLogoutAllOptions = Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>;

/**
 * Hook to logout the current user from all devices
 *
 * @param options - Optional mutation configuration options
 * @returns Mutation object with mutate, isLoading, error, etc.
 *
 * @example
 * ```typescript
 * function LogoutAllButton() {
 *   const logoutAllMutation = useLogoutAll({
 *     onSuccess: () => {
 *       clearToken();
 *       window.location.href = '/login';
 *     },
 *   });
 *
 *   return (
 *     <button onClick={() => logoutAllMutation.mutate()}>
 *       Logout from all devices
 *     </button>
 *   );
 * }
 * ```
 */
export const useLogoutAll = (options?: UseLogoutAllOptions) => {
  return useMutation<void, Error, void>({
    mutationFn: logoutAll,
    ...options,
  });
};
