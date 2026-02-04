import { buildRemoteRoutes } from './route-builder';
import { CLOUD_ROUTES } from './route-registry';

/**
 * Cloud micro-frontend routes (catch-all)
 * Handles: dashboard, companies, settings, etc.
 */
export const getCloudRoutes = () => buildRemoteRoutes(CLOUD_ROUTES);
