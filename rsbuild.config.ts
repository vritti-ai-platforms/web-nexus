import fs from 'node:fs';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

// Load environment variables from .env files
// By default, loadEnv looks for PUBLIC_ prefixed variables
const { publicVars } = loadEnv();

const useHttps = process.env.USE_HTTPS === 'true';
const protocol = useHttps ? 'https' : 'http';
const defaultApiHost = `${protocol}://local.vrittiai.com:3000`;

export default defineConfig({
  source: {
    define: publicVars, // Inject PUBLIC_ prefixed env vars
  },
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
    ...(useHttps && {
      https: {
        key: fs.readFileSync('./certs/local.vrittiai.com+4-key.pem'),
        cert: fs.readFileSync('./certs/local.vrittiai.com+4.pem'),
      },
    }),
    proxy: {
      '/api': {
        target: process.env.REACT_API_HOST || defaultApiHost,
        changeOrigin: true,
        secure: false, // Allow self-signed certificates in local development
        pathRewrite: (reqPath) => reqPath.replace(/^\/api/, ''),
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
        '@vritti/quantum-ui/theme': {
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
