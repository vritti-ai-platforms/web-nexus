import { useRoutes } from 'react-router-dom';
import { useAuth } from '../providers';
import { authenticatedRoutes, publicRoutes } from '../routes';
import { MicrofrontendSkeletonFullPage } from '../utils/MircrofrontendFullPageSkeleton';

/**
 * AppRender component that handles dynamic route registration based on auth state
 *
 * This component:
 * - Consumes auth context from AuthProvider
 * - Determines which routes to render based on authentication state
 * - Shows loading screen while verifying authentication
 *
 * Must be wrapped by AuthProvider to access auth context.
 *
 * @example
 * ```tsx
 * <AuthProvider>
 *   <AppRender />
 * </AuthProvider>
 * ```
 */
export const AppRender: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Call ALL hooks before any conditional returns to satisfy React's hooks rules
  // Hooks must be called in the same order on every render
  const routes = isAuthenticated ? authenticatedRoutes : publicRoutes;
  const routeElement = useRoutes(routes);

  // Now safe to do conditional returns
  if (isLoading) {
    return <MicrofrontendSkeletonFullPage />;
  }

  return routeElement;
};
