import { RemoteRoutes } from '../utils/RemoteRoutes';
import type { HostRoute, RemoteRouteEntry } from './types';

/**
 * Builds a host route from a remote route entry
 */
export const buildRemoteRoute = (entry: RemoteRouteEntry): HostRoute => ({
  path: entry.path,
  element: (
    <RemoteRoutes
      remoteName={entry.remoteName}
      moduleName={entry.moduleName}
      dataKey={entry.dataKey}
    />
  ),
  metadata: entry.metadata,
});

/**
 * Builds multiple host routes from remote route entries
 */
export const buildRemoteRoutes = (entries: RemoteRouteEntry[]): HostRoute[] =>
  entries.map(buildRemoteRoute);
