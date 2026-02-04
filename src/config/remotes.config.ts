/**
 * Remote Module Federation Configuration
 *
 * This file defines all remote micro-frontends that will be loaded
 * by the host application. All remotes are loaded unconditionally at startup.
 *
 * ENVIRONMENT-DRIVEN APPROACH:
 * - Automatically detects protocol (HTTP/HTTPS) from window.location.protocol
 * - Uses PUBLIC_ prefixed environment variables (Rsbuild convention)
 * - Local mode: PORT env vars defined → port-based routing
 * - Production mode: PORT env vars undefined → path-based routing with PUBLIC_MF_BASE_URL
 */

export interface RemoteConfig {
  name: string;
  entry: string;
  exposedModule: string;
}

interface EnvironmentConfig {
  isLocal: boolean;
  protocol: string;
  host: string;
  port: string;
}

/**
 * Get environment variable value by key name
 * Since Rsbuild uses static replacement at build time, we need a static mapping
 * @param key - The environment variable key to access
 * @returns The environment variable value or undefined
 */
const getEnvVar = (key: string): string | undefined => {
  // Static mapping required because import.meta.env uses build-time replacement
  const envMap: Record<string, string | undefined> = {
    PUBLIC_AUTH_MF_PORT: import.meta.env.PUBLIC_AUTH_MF_PORT,
    PUBLIC_CLOUD_MF_PORT: import.meta.env.PUBLIC_CLOUD_MF_PORT,
    PUBLIC_MF_BASE_URL: import.meta.env.PUBLIC_MF_BASE_URL,
  };
  return envMap[key];
};

/**
 * Detects the current environment and protocol configuration
 * @returns Environment configuration object with protocol, host, and environment detection
 */
const getEnvironmentConfig = (): EnvironmentConfig => {
  // SSR/build time fallback
  if (typeof window === 'undefined') {
    return {
      isLocal: true,
      protocol: 'http',
      host: 'local.vrittiai.com',
      port: '3012',
    };
  }

  const { protocol, hostname, port } = window.location;

  // Detect local environment by hostname pattern
  const isLocal = hostname.includes('local.vrittiai.com');

  return {
    isLocal,
    protocol: protocol.replace(':', ''), // 'http' or 'https'
    host: hostname,
    port: port || (protocol === 'https:' ? '443' : '80'),
  };
};

/**
 * Builds the remote entry URL based on environment variables and configuration
 * @param config - Configuration object with port env var name and production path
 * @returns Dynamically constructed manifest URL
 */
const buildRemoteEntry = (config: {
  portEnvVar: string; // Environment variable name (e.g., 'PUBLIC_AUTH_MF_PORT')
  prodPath: string;
}): string => {
  const { protocol, host } = getEnvironmentConfig();

  // Check if the port environment variable is defined
  // Rsbuild exposes PUBLIC_ prefixed env vars via import.meta.env
  const remotePort = getEnvVar(config.portEnvVar);

  if (remotePort) {
    // Local: port-based routing with environment variable port
    // Example: http://local.vrittiai.com:3001/mf-manifest.json
    return `${protocol}://${host}:${remotePort}/mf-manifest.json`;
  } else {
    // Production: path-based routing with MF_BASE_URL
    // Example: https://mf.vrittiai.com/auth-microfrontend/mf-manifest.json
    const mfBaseUrl = import.meta.env.PUBLIC_MF_BASE_URL || `${protocol}://${host}`;
    return `${mfBaseUrl}/${config.prodPath}/mf-manifest.json`;
  }
};

/**
 * Registry of all remote micro-frontends
 * Add new remotes here as they are developed
 *
 * Each remote uses buildRemoteEntry() to automatically detect:
 * - Protocol (HTTP/HTTPS) from current page
 * - Local mode: Uses environment variable port (e.g., PUBLIC_AUTH_MF_PORT=3001)
 * - Production mode: Uses PUBLIC_MF_BASE_URL + prodPath
 *
 * Local example (with PUBLIC_AUTH_MF_PORT=3001):
 *   https://local.vrittiai.com:3001/mf-manifest.json
 *
 * Production example (with PUBLIC_MF_BASE_URL=https://mf.vrittiai.com):
 *   https://mf.vrittiai.com/auth-microfrontend/mf-manifest.json
 *
 * To run in local mode, set environment variables in .env:
 *   PUBLIC_AUTH_MF_PORT=3001
 *
 * To run in production mode, set in .env:
 *   PUBLIC_MF_BASE_URL=https://mf.vrittiai.com
 *   (and remove or comment out PUBLIC_AUTH_MF_PORT)
 */
export const ALL_REMOTES: RemoteConfig[] = [
  {
    name: 'VrittiAuth',
    entry: buildRemoteEntry({
      portEnvVar: 'PUBLIC_AUTH_MF_PORT',
      prodPath: 'auth-microfrontend',
    }),
    exposedModule: 'routes',
  },
  {
    name: 'VrittiCloud',
    entry: buildRemoteEntry({
      portEnvVar: 'PUBLIC_CLOUD_MF_PORT',
      prodPath: 'cloud-microfrontend',
    }),
    exposedModule: 'routes',
  },
];
