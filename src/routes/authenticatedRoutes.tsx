import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layouts/AppLayout';
import { DemoPage } from '../pages/DemoPage';
import { RemoteRoutes } from '../utils/RemoteRoutes';

/**
 * Routes available when the user IS authenticated (token exists)
 *
 * These routes are registered when getToken() returns a valid token.
 * Includes dashboard, settings, and other protected pages.
 */
export const authenticatedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DemoPage />,
      },
      {
        path: 'account/*',
        element: <RemoteRoutes remoteName="VrittiAuth" moduleName="routes" dataKey="accountRoutes" />,
      },
    ],
  },
  {
    // Redirect any other unmatched path to dashboard
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
];
