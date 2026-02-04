import { buildRemoteRoutes } from './route-builder';
import { AUTH_ROUTES } from './route-registry';

/**
 * Auth micro-frontend routes
 * Handles: login, signup, forgot-password, mfa, onboarding
 */
export const getAuthRoutes = () => buildRemoteRoutes(AUTH_ROUTES);
