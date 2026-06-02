import { defineConfig } from 'vite';

// Los módulos de vistas usan `React.createElement` y JSX clásico apoyándose en un
// `React` en alcance. `jsxInject` agrega `import React from 'react'` a cada archivo
// .jsx automáticamente, así no hace falta tocar los componentes existentes.
export default defineConfig({
  base: './',
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  server: { port: 5173, open: true },
});
