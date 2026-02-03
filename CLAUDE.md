# vritti-web-nexus - Development Best Practices

This document outlines the conventions and best practices for the vritti-web-nexus frontend application.

## Project Overview

vritti-web-nexus is the main host React application built with:
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **@vritti/quantum-ui** component library
- **Module Federation** for micro-frontend architecture (host application)
- **React Router** for navigation
- **TanStack Query** for server state management

## Critical Best Practices

### 1. Color Usage Guidelines

**CRITICAL: Never hardcode colors.** Always use design system tokens from quantum-ui.

Available semantic colors:
- `primary` / `primary-foreground` - Brand primary color
- `secondary` / `secondary-foreground` - Secondary actions
- `muted` / `muted-foreground` - Subtle backgrounds/text
- `accent` / `accent-foreground` - Accent highlights
- `destructive` / `destructive-foreground` - Error/danger states
- `warning` / `warning-foreground` - Warning states
- `success` / `success-foreground` - Success states
- `background` / `foreground` - Base colors
- `card` / `card-foreground` - Card surfaces
- `border`, `input`, `ring` - UI element colors

```typescript
// WRONG - Hardcoded colors
<div style={{ color: '#16a34a' }} />
<div style={{ backgroundColor: 'rgba(22, 163, 74, 0.15)' }} />
<div className="text-green-600" />  // Tailwind palette colors may not match theme

// CORRECT - Design system tokens
<div className="text-success" />
<div className="bg-success/15 text-success" />
<CheckCircle className="text-success" />
```

For opacity variants, use Tailwind's opacity modifier:
```typescript
<div className="bg-success/15" />  // 15% opacity
<div className="bg-destructive/20" />  // 20% opacity
```

For SVG icons that need dynamic fill colors, use CSS variables:
```typescript
// For custom SVG icons
<path style={{ fill: 'var(--color-foreground)' }} />
```

### 2. Component Imports

Always import quantum-ui components from their specific paths:
```typescript
// CORRECT
import { Button } from '@vritti/quantum-ui/Button';
import { Typography } from '@vritti/quantum-ui/Typography';

// WRONG - Don't use barrel imports
import { Button, Typography } from '@vritti/quantum-ui';
```

### 3. Styling Guidelines

- Use Tailwind CSS v4 utility classes
- Import `cn` utility from quantum-ui for class merging
- Follow the design token system
- Support dark mode automatically via design tokens
- Use quantum-ui components whenever possible

### 4. Environment Variables

**CRITICAL: Rsbuild uses `PUBLIC_` prefix for client-side environment variables.**

Environment variables are exposed via `import.meta.env` (NOT `process.env` which is for Node.js):
- Variables MUST have `PUBLIC_` prefix to be accessible in browser code
- Type declarations go in `src/env.d.ts` via `ImportMetaEnv` interface
- Use type-safe access pattern with `getEnvVar()` helper for dynamic key access

Available environment variables:
- `PUBLIC_VRITTI_AUTH_PORT` - Auth microfrontend port (local dev, e.g., '3001')
- `PUBLIC_VRITTI_CLOUD_PORT` - Cloud microfrontend port (local dev, e.g., '3002')
- `PUBLIC_MF_BASE_URL` - Module Federation base URL (production, e.g., 'https://mf.vrittiai.com')

**Type declarations** (`src/env.d.ts`):
```typescript
interface ImportMetaEnv {
  // Module Federation remote ports (local development)
  readonly PUBLIC_VRITTI_AUTH_PORT?: string;
  readonly PUBLIC_VRITTI_CLOUD_PORT?: string;

  // Module Federation base URL (production)
  readonly PUBLIC_MF_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

**Type-safe dynamic access** (`src/config/remotes.config.ts`):
```typescript
// Rsbuild's import.meta.env doesn't support dynamic key access by default
const getEnvVar = (key: string): string | undefined => {
  return (import.meta.env as Record<string, string | undefined>)[key];
};

// Usage
const remotePort = getEnvVar('PUBLIC_VRITTI_AUTH_PORT');
```

### 5. Module Federation Configuration

As the host application:
- Remote micro-frontends are loaded dynamically
- Shared dependencies are configured in `rsbuild.config.ts`
- Auth module is loaded from `vritti-auth`

**Configuration Best Practices**:

1. **Never hardcode protocols or hosts** - Use environment-driven configuration
2. **Dynamic protocol detection** - Auto-detect HTTP/HTTPS from `window.location.protocol`
3. **Environment-based routing**:
   - **Local mode**: Port-based routing when `PUBLIC_*_PORT` env vars are defined
   - **Production mode**: Path-based routing when `PUBLIC_MF_BASE_URL` is defined
4. **SSR-safe fallbacks** - Handle `window` being undefined during build

**Environment detection** (`src/config/remotes.config.ts`):
```typescript
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
```

**Building remote URLs** (`src/config/remotes.config.ts`):
```typescript
const buildRemoteEntry = (config: {
  portEnvVar: string;    // e.g., 'PUBLIC_VRITTI_AUTH_PORT'
  prodPath: string;      // e.g., 'auth-microfrontend'
}): string => {
  const { protocol, host } = getEnvironmentConfig();

  // Check if port environment variable is defined
  const remotePort = getEnvVar(config.portEnvVar);

  if (remotePort) {
    // Local: port-based routing
    // Example: http://local.vrittiai.com:3001/mf-manifest.json
    return `${protocol}://${host}:${remotePort}/mf-manifest.json`;
  } else {
    // Production: path-based routing with MF_BASE_URL
    // Example: https://mf.vrittiai.com/auth-microfrontend/mf-manifest.json
    const mfBaseUrl = import.meta.env.PUBLIC_MF_BASE_URL || `${protocol}://${host}`;
    return `${mfBaseUrl}/${config.prodPath}/mf-manifest.json`;
  }
};

// Usage in ALL_REMOTES array
export const ALL_REMOTES: RemoteConfig[] = [
  {
    name: 'VrittiAuth',
    entry: buildRemoteEntry({
      portEnvVar: 'PUBLIC_VRITTI_AUTH_PORT',
      prodPath: 'auth-microfrontend',
    }),
    exposedModule: 'routes',
  },
];
```

**DO**:
- ✅ Use `getEnvironmentConfig()` to detect protocol dynamically
- ✅ Use `getEnvVar()` for type-safe environment variable access
- ✅ Separate local and production URL logic with environment variables
- ✅ Provide SSR-safe fallbacks for `window` access

**DON'T**:
- ❌ Hardcode `http://` or `https://` in remote URLs
- ❌ Use `process.env` (that's for Node.js, not browser)
- ❌ Access `import.meta.env['KEY']` directly without type casting
- ❌ Forget `PUBLIC_` prefix on environment variables

### 6. Form Handling

- Use `react-hook-form` with `zod` schemas for validation
- Use quantum-ui Form components (`Form`, `Field`, `FieldGroup`, etc.)
- Mutations should use TanStack Query hooks

## Common Patterns

### Icon Colors in Light/Dark Mode

For custom SVG icons that need to adapt to theme:
```typescript
export const MyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path style={{ fill: 'var(--color-foreground)' }} d="..." />
  </svg>
);
```

### Success/Error States

```typescript
// Success state
<div className="bg-success/15 text-success rounded-lg p-4">
  <CheckCircle className="h-5 w-5 text-success" />
  <span>Operation successful</span>
</div>

// Error state
<div className="bg-destructive/15 text-destructive rounded-lg p-4">
  <AlertCircle className="h-5 w-5 text-destructive" />
  <span>An error occurred</span>
</div>
```

## Starting the Application

**Prerequisites**:
- `vritti-auth` must be running on port 3001 (or the port specified in `PUBLIC_VRITTI_AUTH_PORT`)
- If using HTTPS mode, SSL certificates must be in `./certs/` directory

**Available npm scripts**:
```bash
# HTTP mode (default)
pnpm dev                    # Starts on http://local.vrittiai.com:3012

# HTTPS mode
pnpm dev:ssl                # Starts on https://local.vrittiai.com:3012

# With cloud microfrontend
pnpm dev:cloud              # HTTP mode with cloud remote
pnpm dev:ssl:cloud          # HTTPS mode with cloud remote
```

**Access URLs**:
- **HTTP**: `http://local.vrittiai.com:3012`
- **HTTPS**: `https://local.vrittiai.com:3012`

**Important Notes**:
- Protocol (HTTP/HTTPS) is auto-detected from `window.location.protocol`
- Remote microfrontends MUST run on the same protocol as the host
- If host runs on HTTPS, all remotes must also run on HTTPS
- Port conflicts will prevent the application from starting
