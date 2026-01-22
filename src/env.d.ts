/// <reference types="@rsbuild/core/types" />

/**
 * Environment variable type declarations for Rsbuild
 * PUBLIC_ prefixed variables are exposed to the client
 */
declare namespace NodeJS {
  interface ProcessEnv {
    PUBLIC_VRITTI_AUTH_ENTRY?: string;
  }
}

/**
 * Imports the SVG file as a React component.
 * @requires [@rsbuild/plugin-svgr](https://npmjs.com/package/@rsbuild/plugin-svgr)
 */
declare module '*.svg?react' {
  import type React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
