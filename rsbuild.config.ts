import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  html: {
    tags: [
      {
        tag: 'script',
        head: true,
        append: false, // Insert at beginning of head, before other scripts
        // Inline script to set dark mode before first paint
        children: `(function(){var t=localStorage.getItem('theme'),d=window.matchMedia('(prefers-color-scheme:dark)').matches;if(t==='dark'||(!t&&d))document.documentElement.classList.add('dark');})();`,
      },
    ],
  },
  server: {
    port: 3012,
    proxy: {
      '/api': {
        target: process.env.REACT_API_HOST || 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'vritti_nexus_host',
      remotes: {}, // Using runtime registration
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^19.2.0',
          eager: true,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.2.0',
          eager: true,
        },
        'react-router-dom': {
          singleton: true,
          eager: true,
        },
        '@vritti/quantum-ui': {
          singleton: true,
          eager: true,
        },
        axios: {
          singleton: true,
          eager: true,
        },
        '@tanstack/react-query': {
          singleton: true,
          eager: true,
        },
      },
      dts: false,
    }),
  ],
  // PostCSS configuration is in postcss.config.mjs
});
