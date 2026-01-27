/**
 * Remote Module Federation Configuration
 *
 * This file defines all remote micro-frontends that will be loaded
 * by the host application. All remotes are loaded unconditionally at startup.
 *
 * ZERO ENVIRONMENT VARIABLES APPROACH:
 * - Uses window.location.origin to construct manifest URLs dynamically
 * - Same build works in any environment (dev, staging, production)
 * - Micro-frontends are served from subdirectories on the same domain
 */

export interface RemoteConfig {
  name: string;
  entry: string;
  exposedModule: string;
}

/**
 * Get the current origin for constructing manifest URLs
 * Falls back to local development URL if window is not available (SSR)
 */
const getOrigin = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Fallback for local development (SSR/build time)
  return 'http://local.vrittiai.com:3001';
};

/**
 * Registry of all remote micro-frontends
 * Add new remotes here as they are developed
 */
export const ALL_REMOTES: RemoteConfig[] = [
  {
    name: 'VrittiAuth',
    entry: `${getOrigin()}/vritti-auth/mf-manifest.json`,
    exposedModule: 'routes',
  },
  // Add more remotes as needed:
  // {
  //   name: 'VrittiCloud',
  //   entry: `${getOrigin()}/vritti-cloud/mf-manifest.json`,
  //   exposedModule: 'routes',
  // },
];
