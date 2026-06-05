import { defineConfig } from 'vite';

// Los módulos de vistas usan JSX clásico (React.createElement) apoyándose en un
// `React` en alcance. jsxInject agrega `import React from 'react'` a cada .jsx,
// así no hace falta tocar los componentes existentes.
export default defineConfig({
  base: './',
  esbuild: { jsxInject: `import React from 'react'` },
  build: { outDir: 'dist', emptyOutDir: true },
  server: { port: 5173 },
});
