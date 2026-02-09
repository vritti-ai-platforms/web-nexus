import { type UseMutationOptions, type UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { type AuthStatusResponse, getCurrentUser, logout, logoutAll } from '../services';

type UseUserOptions = Omit<UseQueryOptions<AuthStatusResponse, Error>, 'queryKey' | 'queryFn'>;

export function useUser(options?: UseUserOptions) {
  return useQuery<AuthStatusResponse, Error>({
    queryKey: ['auth', 'user'],
    queryFn: getCurrentUser,
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
