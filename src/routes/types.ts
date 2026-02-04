import type { ReactNode } from 'react';

/**
 * Route metadata for auth, navigation, and analytics
 */
export interface RouteMetadata {
  title?: string;
  requiresAuth?: boolean;
  roles?: string[];
  breadcrumb?: string;
}

/**
 * Remote route configuration entry
 */
export interface RemoteRouteEntry {
  path: string;
  remoteName: string;
  moduleName: string;
  dataKey?: string;
  metadata?: RouteMetadata;
}

/**
 * Host route with element
 */
export interface HostRoute {
  path: string;
  element: ReactNode;
  metadata?: RouteMetadata;
}

/**
 * Remote names as const for type safety
 */
export const REMOTE_NAMES = {
  AUTH: 'VrittiAuth',
  CLOUD: 'VrittiCloud',
} as const;

export type RemoteName = (typeof REMOTE_NAMES)[keyof typeof REMOTE_NAMES];
