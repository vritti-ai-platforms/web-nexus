import axios from '@vritti/quantum-ui/axios';
import type { AxiosResponse } from 'axios';

/**
 * User data from the authentication response
 */
export interface User {
  /** User's unique identifier */
  id: string;
  /** User's email address */
  email: string;
  /** User's first name */
  firstName?: string | null;
  /** User's last name */
  lastName?: string | null;
  /** Whether the user's email has been verified */
  emailVerified: boolean;
  /** Whether the user's phone number has been verified */
  phoneVerified: boolean;
  /** Current account status */
  accountStatus: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  /** Current onboarding step */
  onboardingStep: 'EMAIL_VERIFICATION' | 'PASSWORD_SETUP' | 'PHONE_VERIFICATION' | 'TWO_FACTOR_SETUP' | 'COMPLETE';
  /** Whether user has set a password */
  hasPassword: boolean;
  /** Phone number */
  phone?: string | null;
  /** Phone country code */
  phoneCountry?: string | null;
  /** Profile picture URL */
  profilePictureUrl?: string | null;
  /** User locale */
  locale: string;
  /** User timezone */
  timezone: string;
  /** Account creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Last login timestamp */
  lastLoginAt?: string | null;
  /** Email verification timestamp */
  emailVerifiedAt?: string | null;
  /** Phone verification timestamp */
  phoneVerifiedAt?: string | null;
}

/**
 * Response from the GET /auth/me endpoint
 * Returns authentication status without throwing errors
 */
export interface AuthStatusResponse {
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** User data (only present when authenticated) */
  user?: User;
  /** JWT access token (only present when authenticated) */
  accessToken?: string;
  /** Token expiry in seconds (only present when authenticated) */
  expiresIn?: number;
}

/**
 * Fetches the current user's authentication status
 *
 * This is a public endpoint that checks authentication via httpOnly cookie.
 * Returns { isAuthenticated: false } if not authenticated (no 401 error).
 *
 * @returns Promise resolving to authentication status with optional user data
 *
 * @example
 * ```typescript
 * const status = await getCurrentUser();
 * if (status.isAuthenticated) {
 *   console.log(`Welcome, ${status.user?.firstName}!`);
 * } else {
 *   console.log('Not authenticated');
 * }
 * ```
 */
export async function getCurrentUser(): Promise<AuthStatusResponse> {
  const response: AxiosResponse<AuthStatusResponse> = await axios.get('cloud-api/auth/me', {
    public: true, // This is a public endpoint, skip auth header
  });
  return response.data;
}

/**
 * Logs out the current user from the current device
 *
 * @returns Promise resolving when logout is complete
 * @throws Error if logout fails
 *
 * @example
 * ```typescript
 * try {
 *   await logout();
 *   // Redirect to login page
 *   window.location.href = '/login';
 * } catch (error) {
 *   console.error('Logout failed:', error);
 * }
 * ```
 */
export async function logout(): Promise<void> {
  await axios.post(
    'cloud-api/auth/logout',
    {},
    {
      successMessage: 'Logged out successfully',
    },
  );
}

/**
 * Logs out the current user from all devices
 *
 * @returns Promise resolving when logout is complete
 * @throws Error if logout fails
 *
 * @example
 * ```typescript
 * try {
 *   await logoutAll();
 *   // Redirect to login page
 *   window.location.href = '/login';
 * } catch (error) {
 *   console.error('Logout from all devices failed:', error);
 * }
 * ```
 */
export async function logoutAll(): Promise<void> {
  await axios.post(
    'cloud-api/auth/logout-all',
    {},
    {
      successMessage: 'Logged out from all devices',
    },
  );
}
