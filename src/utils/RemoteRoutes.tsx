import { loadRemote } from '@module-federation/runtime';
import { Suspense, useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
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
    console.log(`[RemoteRoutes] Loaded module ${remoteName}/${moduleName}:`, module);
    return (module as any)?.default || module;
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
  const [routes, setRoutes] = useState<any[]>([]);
  const [errorLoading, setErrorLoading] = useState(false);

  // Cache routes to avoid re-loading the same module multiple times
  const [routeCache] = useState<Map<string, any>>(new Map());

  /**
   * Retrieves routes from cache or loads them from the remote module
   */
  const getRoutesFromRemote = async (
    remoteName: string,
    moduleName: string,
  ) => {
    const cacheKey = `${remoteName}/${moduleName}`;

    if (!routeCache.has(cacheKey)) {
      const loadedModule = await loadRemoteModule(remoteName, moduleName);
      routeCache.set(cacheKey, loadedModule);
    }

    return routeCache.get(cacheKey);
  };

  useEffect(() => {
    const initializeRoutes = async () => {
      try {
        const loadedRoutes = await getRoutesFromRemote(remoteName, moduleName);
        console.log(`[RemoteRoutes] Loaded routes from ${remoteName}:`, loadedRoutes);

        // Extract routes based on dataKey if provided, otherwise use the entire module
        const extractedRoutes =
          (dataKey ? loadedRoutes?.[dataKey] : loadedRoutes) || [];

        console.log(`[RemoteRoutes] Extracted routes with dataKey="${dataKey}":`, extractedRoutes);
        setRoutes(extractedRoutes);

        // Add minimum delay to show skeleton for smoother UX
        await new Promise((resolve) => setTimeout(resolve, 500));
        setReady(true);
      } catch (error) {
        console.error(`[RemoteRoutes] Error initializing routes:`, error);
        setErrorLoading(true);
      }
    };

    initializeRoutes();
  }, [remoteName, moduleName, dataKey]);

  // Generate routing based on loaded routes
  const routing = useRoutes(routes);

  // Error state
  if (errorLoading) {
    return (
      <div>
        Failed to load remote module. Please check if the microfrontend is
        running.
      </div>
    );
  }

  // Loading state
  if (!ready) {
    return <MicrofrontendSkeletonFullPage />;
  }

  // Debug: Log what useRoutes returned
  console.log(`[RemoteRoutes] useRoutes returned:`, routing);
  console.log(`[RemoteRoutes] Routes being used:`, routes);

  // Render the loaded routes
  return <Suspense fallback={<MicrofrontendSkeletonFullPage />}>{routing}</Suspense>;
};
