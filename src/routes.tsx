import type { ReactNode } from 'react';
import { RemoteRoutes } from './utils/RemoteRoutes';

const subDomain = window.location.hostname.split('.')[0];

export const isCloud = subDomain === 'cloud';

export type Route = {
  path: string;
  element: ReactNode;
};

export const routes: Route[] = [];

if (isCloud) {
  routes.push({
    path: '/*',
    element: <RemoteRoutes remoteName="VrittiAuth" moduleName="routes" dataKey="authRoutes" />,
  });
}
