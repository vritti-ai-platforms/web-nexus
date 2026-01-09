/**
 * Remote Module Federation Configuration
 *
 * This file defines all remote micro-frontends that will be loaded
 * by the host application. All remotes are loaded unconditionally at startup.
 */

export interface RemoteConfig {
  name: string;
  entry: string;
  exposedModule: string;
  baseUrl?: string; // Base URL for loading remote assets like CSS
}

/**
 * Registry of all remote micro-frontends
 * Add new remotes here as they are developed
 */
export const ALL_REMOTES: RemoteConfig[] = [
  {
    name: 'VrittiAuth',
    entry: import.meta.env.VITE_VRITTI_AUTH_URL || 'http://localhost:3001/mf-manifest.json',
    exposedModule: 'routes',
    baseUrl: import.meta.env.VITE_VRITTI_AUTH_BASE_URL || 'http://localhost:3001',
  },
  // Add more remotes as needed:
  // {
  //   name: 'VrittiCloud',
  //   entry: import.meta.env.VITE_VRITTI_CLOUD_URL || 'http://localhost:3002/mf-manifest.json',
  //   exposedModule: 'routes',
  // },
];
