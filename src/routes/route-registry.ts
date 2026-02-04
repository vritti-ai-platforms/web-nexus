import type { RemoteRouteEntry } from './types';
import { REMOTE_NAMES } from './types';

/**
 * Auth micro-frontend routes
 * Handles: login, signup, forgot-password, mfa, onboarding
 */
export const AUTH_ROUTES: RemoteRouteEntry[] = [
  {
    path: '/login',
    remoteName: REMOTE_NAMES.AUTH,
    moduleName: 'routes',
    dataKey: 'authRoutes',
    metadata: { title: 'Login', requiresAuth: false },
  },
  {
    path: '/signup',
    remoteName: REMOTE_NAMES.AUTH,
    moduleName: 'routes',
    dataKey: 'authRoutes',
    metadata: { title: 'Sign Up', requiresAuth: false },
  },
  {
    path: '/signup-success',
    remoteName: REMOTE_NAMES.AUTH,
    moduleName: 'routes',
    dataKey: 'authRoutes',
    metadata: { title: 'Sign Up Success', requiresAuth: false },
  },
  {
    path: '/forgot-password',
    remoteName: REMOTE_NAMES.AUTH,
    moduleName: 'routes',
    dataKey: 'authRoutes',
    metadata: { title: 'Forgot Password', requiresAuth: false },
  },
  {
    path: '/mfa-verify',
    remoteName: REMOTE_NAMES.AUTH,
    moduleName: 'routes',
    dataKey: 'authRoutes',
    metadata: { title: 'Verify MFA', requiresAuth: false },
  },
  {
    path: '/onboarding/*',
    remoteName: REMOTE_NAMES.AUTH,
    moduleName: 'routes',
    dataKey: 'authRoutes',
    metadata: { title: 'Onboarding', requiresAuth: true },
  },
];

/**
 * Cloud micro-frontend routes (catch-all)
 * Handles: dashboard, companies, settings, etc.
 */
export const CLOUD_ROUTES: RemoteRouteEntry[] = [
  {
    path: '/*',
    remoteName: REMOTE_NAMES.CLOUD,
    moduleName: 'routes',
    dataKey: 'cloudRoutes',
    metadata: { title: 'Dashboard', requiresAuth: true },
  },
];
