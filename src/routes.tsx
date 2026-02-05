import type { RouteObject } from 'react-router-dom';
import { AppLayout } from './components/layouts/AppLayout';
import { DemoPage } from './pages/DemoPage';
import { RemoteRoutes } from './utils/RemoteRoutes';

const subDomain = window.location.hostname.split('.')[0];

export const isCloud = subDomain === 'cloud';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: 'dashboard',
        element: <DemoPage />,
      },
      {
        path: 'account/*',
        element: <RemoteRoutes remoteName="VrittiAuth" moduleName="routes" dataKey="accountRoutes" />,
      },
    ],
  },
];

if (isCloud) {
  routes.push({
    path: '/*',
    element: <RemoteRoutes remoteName="VrittiAuth" moduleName="routes" dataKey="authRoutes" />,
  });
}
