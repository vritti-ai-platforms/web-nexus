import { type UseMutationOptions, type UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { type AuthStatusResponse, getAuthStatus, logout, logoutAll } from '../services';

type UseAuthStatusOptions = Omit<UseQueryOptions<AuthStatusResponse, Error>, 'queryKey' | 'queryFn'>;

export function useAuthStatus(options?: UseAuthStatusOptions) {
  return useQuery<AuthStatusResponse, Error>({
    queryKey: ['auth', 'status'],
    queryFn: getAuthStatus,
    staleTime: Infinity,
    retry: false,
    ...options,
  });
}

type UseLogoutOptions = Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>;

export function useLogout(options?: UseLogoutOptions) {
  return useMutation<void, Error, void>({
    mutationFn: logout,
    ...options,
  });
}

type UseLogoutAllOptions = Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>;

export function useLogoutAll(options?: UseLogoutAllOptions) {
  return useMutation<void, Error, void>({
    mutationFn: logoutAll,
    ...options,
  });
}
