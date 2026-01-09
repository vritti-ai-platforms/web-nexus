import { registerRemotes } from '@module-federation/enhanced/runtime';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
import { ALL_REMOTES } from './config/remotes.config';

/**
 * Register all remote micro-frontends at startup
 * This allows the host to dynamically load routes from all remotes
 */
registerRemotes(
  ALL_REMOTES.map((remote) => ({
    name: remote.name,
    entry: remote.entry,
  })),
);

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
