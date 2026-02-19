import type { RouteObject } from 'react-router-dom';
import { RemoteRoutes } from '../utils/RemoteRoutes';

/**
 * Routes available when the user is NOT authenticated (no token exists)
 *
 * These routes are registered when getToken() returns undefined/null.
 * Includes authentication-related pages like login, signup, password reset, etc.
 */
export const publicRoutes: RouteObject[] = [
  {
    path: '/*',
    element: <RemoteRoutes remoteName="VrittiAuth" moduleName="routes" dataKey="authRoutes" />,
  },
];
