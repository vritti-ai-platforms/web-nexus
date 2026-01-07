import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './routes';

// Create a single QueryClient instance to be shared across the app and microfrontends
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const AppRoutes = () => {
  return useRoutes(routes);
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
