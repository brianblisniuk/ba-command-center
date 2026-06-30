# CLAUDE.md — reglas del proyecto (Command Center Pasaporte Negro)

Prototipo de alta fidelidad de un *command center* para Pasaporte Negro (operador de
viajes). Vite + React, **TS-ready**. Leé `README.md` y `SUPABASE.md` primero.

## Modelo mental

- Componentes = IIFEs que se exponen en `window` y usan `React.createElement`
  (no JSX literal, salvo `tweaks-panel.jsx`). Se comparten vía `window.X`, no imports.
- `src/setup.js` pone `window.React`/`window.ReactDOM`; `vite.config.js` inyecta
  `import React from 'react'` en cada `.jsx` (`esbuild.jsxInject`). `src/main.jsx`
  importa todo **en orden** y `app.jsx` monta la app.
- Si agregás un módulo nuevo: exponé a `window` y sumá su import en `main.jsx`
  **antes** de `./app.jsx`.

## Reglas al editar

1. **Diseño**: usar solo tokens `var(--…)` de `src/styles/ds.css`. Paleta laurel/bone/
   brass. No inventar colores ni fonts (Fraunces / Inter / JetBrains Mono). Respetar
   light+dark (`[data-theme]`) y acento (`[data-accent]`).
2. **No declarar `const styles = {}` global** (colisiona entre módulos). Inline o nombre único.
3. **Datos**: única fuente `window.BA` (`src/lib/data.js`). Para producción NO tocar
   componentes: reemplazar el cuerpo de `BA.source.*` por los `fetch` reales
   (ver `SUPABASE.md`) y mantener los nombres de campo del mock.
4. **Iconos** `<Icon name>`; charts `Spark/BarChart/Donut/Ring`. Default `1em`; el tamaño
   real lo da el CSS de la clase contenedora.
5. **Vocabulario**: español rioplatense (voseo). Evitar "lujo/VIP/premium/exclusivo/
   bespoke/curado". Pilares: Acceso · Autoría · Afinidad.
6. **Regla dura del dominio**: una salida no sale sin **dos accesos confirmados**
   (alimenta el motor GO/NO-GO). El viaje es una dimensión, no un contenedor (los leads
   viven en Ventas y se ven como Reservas filtrados dentro de la salida).

## No romper

- El shell de dos planos (Negocio ↔ Viaje) y el routing en `app.jsx`.
- El orden de imports en `src/main.jsx` (setup primero, `app.jsx` último).
- El seam `BA.source` (punto de conexión a Supabase).
- Tweaks (`useTweaks`) y su persistencia en localStorage.

## Si `npm run dev` falla

Casi siempre es alcance/orden, no lógica:
- "React is not defined" → revisar `esbuild.jsxInject` en `vite.config.js`.
- "X is not a function/undefined" al montar → un módulo se importó antes que su
  dependencia en `main.jsx`; reordenar.
- `ReactDOM` undefined → `src/setup.js` debe importarse primero.
