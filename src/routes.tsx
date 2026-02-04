import type { RouteObject } from 'react-router-dom';
import { RemoteRoutes } from './utils/RemoteRoutes';
import { AppLayout } from './components/layouts/AppLayout';
import { DemoPage } from './pages/DemoPage';

const subDomain = window.location.hostname.split('.')[0];

export const isCloud = subDomain === 'cloud';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DemoPage />,
      },
      {
        path: 'demo',
        element: <DemoPage />,
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
