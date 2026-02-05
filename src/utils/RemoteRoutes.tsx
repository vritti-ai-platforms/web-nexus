import { loadRemote } from '@module-federation/runtime';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { type RouteObject, useRoutes } from 'react-router-dom';
import { MicrofrontendSkeletonFullPage } from './MircrofrontendFullPageSkeleton';

/**
 * Loads a remote module from a federated application
 * @param remoteName - The name of the remote application
 * @param moduleName - The name of the module to load from the remote
 * @returns The loaded module or undefined if loading fails
 */
const loadRemoteModule = async (remoteName: string, moduleName: string) => {
  try {
    const module = await loadRemote(`${remoteName}/${moduleName}`);
    return (module as { default?: unknown })?.default || module;
  } catch (error) {
    console.error(`[RemoteRoutes] Failed to load ${remoteName}/${moduleName}:`, error);
    return undefined;
  }
};

/**
 * Component that dynamically loads and renders routes from a federated remote application
 *
 * @param remoteName - The name of the remote microfrontend application
 * @param moduleName - The name of the module to load (usually 'mfRoutes')
 * @param dataKey - Optional key to extract specific data from the loaded module
 */
export const RemoteRoutes = ({
  dataKey,
  moduleName,
  remoteName,
}: {
  dataKey?: string;
  moduleName: string;
  remoteName: string;
}) => {
  const [ready, setReady] = useState(false);
  const [routes, setRoutes] = useState<RouteObject[]>([]);
  const [errorLoading, setErrorLoading] = useState(false);

  // Cache routes to avoid re-loading the same module multiple times
  const [routeCache] = useState<Map<string, unknown>>(new Map());

  /**
   * Retrieves routes from cache or loads them from the remote module
   */
  const getRoutesFromRemote = useCallback(
    async (remoteNameArg: string, moduleNameArg: string) => {
      const cacheKey = `${remoteNameArg}/${moduleNameArg}`;

      if (!routeCache.has(cacheKey)) {
        const loadedModule = await loadRemoteModule(remoteNameArg, moduleNameArg);
        routeCache.set(cacheKey, loadedModule);
      }

      return routeCache.get(cacheKey);
    },
    [routeCache],
  );

  useEffect(() => {
    const initializeRoutes = async () => {
      try {
        const loadedRoutes = await getRoutesFromRemote(remoteName, moduleName);

        // Extract routes based on dataKey if provided, otherwise use the entire module
        const routeModule = loadedRoutes as Record<string, RouteObject[]> | RouteObject[];
        const extractedRoutes =
          (dataKey ? (routeModule as Record<string, RouteObject[]>)?.[dataKey] : routeModule) || [];

        console.log('extractedRoutes', extractedRoutes, dataKey);

        setRoutes(extractedRoutes as RouteObject[]);

        // Add minimum delay to show skeleton for smoother UX
        await new Promise((resolve) => setTimeout(resolve, 500));
        setReady(true);
      } catch (error) {
        console.error(`[RemoteRoutes] Error initializing routes:`, error);
        setErrorLoading(true);
      }
    };

    initializeRoutes();
  }, [remoteName, moduleName, dataKey, getRoutesFromRemote]);

  // Generate routing based on loaded routes
  const routing = useRoutes(routes);

  // Error state
  if (errorLoading) {
    return <div>Failed to load remote module. Please check if the microfrontend is running.</div>;
  }

  // Loading state
  if (!ready) {
    return <MicrofrontendSkeletonFullPage />;
  }

  // Render the loaded routes
  return <Suspense fallback={<MicrofrontendSkeletonFullPage />}>{routing}</Suspense>;
};
