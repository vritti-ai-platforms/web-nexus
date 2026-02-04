import type { HostRoute } from './types';
import { getAuthRoutes } from './auth.routes';
import { getCloudRoutes } from './cloud.routes';

const getSubdomain = (): string => {
  if (typeof window === 'undefined') return '';
  return window.location.hostname.split('.')[0];
};

export const isCloud = getSubdomain() === 'cloud';

/**
 * Compose all routes based on environment
 * Order matters: specific paths first, catch-all last
 */
export const routes: HostRoute[] = isCloud
  ? [...getAuthRoutes(), ...getCloudRoutes()]
  : [];

export type { HostRoute, RemoteRouteEntry, RouteMetadata } from './types';
export { REMOTE_NAMES } from './types';
