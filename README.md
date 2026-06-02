# Blisniuk & Amanov · Command Center

Rediseño del prototipo **batwt** como un *command center* negocio-céntrico
(paleta laurel/bone/brass, dashboard moderno + alma editorial Fraunces).
Este repo trae **dos formas de correrlo**: un proyecto **Vite + React (TS-ready)**
y una versión **standalone sin build**.

---

## 1) Correr con Vite (recomendado para seguir desarrollando)

```bash
cd app
npm install
npm run dev      # http://localhost:5173
npm run build    # build de producción a dist/
npm run preview  # previsualizar el build
```

> Requiere Node 18+. La primera vez `npm install` baja React + Vite + TypeScript.

## 2) Correr sin build (standalone)

La carpeta `standalone/` es el prototipo tal cual, sin toolchain. Solo necesita un
static server (los `<script src>` se cargan por HTTP):

```bash
cd app/standalone
python3 -m http.server 8000
# abrir http://localhost:8000/B%26A%20Command%20Center.html
```

Ambas versiones renderizan exactamente lo mismo y comparten el mismo código fuente.

---

## Cómo está armado el build de Vite

Los componentes se escribieron como **IIFEs que se exponen en `window`**
(`window.Puente`, `window.Bandeja`, …) usando `React.createElement` (sin JSX literal,
salvo `tweaks-panel.jsx`). Para que funcionen en Vite **sin reescribirlos**:

- `src/setup.js` setea `window.React` / `window.ReactDOM` **antes** que cualquier módulo.
- `vite.config.js` usa `esbuild.jsxInject` para inyectar `import React from 'react'`
  en cada `.jsx` (así `React` está en alcance en todos lados).
- `src/main.jsx` importa los módulos **en orden** (setup → estilos → data → primitivas
  → vistas → `app.jsx`). `app.jsx` monta `<App/>` en `#root` al importarse.

Esto es deliberadamente conservador: el objetivo es un `npm run dev` que funcione hoy.
Para una migración "más TypeScript", ver abajo.

---

## Estructura

```
app/
├─ package.json · vite.config.js · tsconfig.json · index.html · .gitignore
├─ README.md · CLAUDE.md · SUPABASE.md
├─ src/
│  ├─ setup.js              # expone React/ReactDOM en window (primero)
│  ├─ main.jsx              # orden de imports + montaje + splash
│  ├─ app.jsx               # shell: sidebar, topbar, Cmd-K, routing, tweaks, drawers
│  ├─ tweaks-panel.jsx      # panel de Tweaks (tema, densidad, acento, moneda, operador)
│  ├─ styles/ds.css         # design system: tokens + todos los componentes
│  ├─ lib/
│  │  ├─ data.js            # window.BA — datos (mock) + BA.source (seam a Supabase)
│  │  └─ trip_data.js       # BA.tripData(salidaId)
│  ├─ components/
│  │  ├─ icons.jsx          # <Icon>, charts Spark/BarChart/Donut/Ring
│  │  └─ components.jsx     # Badge, Avatar, OccBar, SalidaCard, StatCard, CardHead
│  └─ views/
│     ├─ puente.jsx         # Hoy · El Puente (copiloto, cola del día, GO/NO-GO, mapa)
│     ├─ views_ops.jsx      # Viajes · Bandeja (triage IA + WhatsApp) · Finanzas
│     ├─ views_sales.jsx    # Ventas · Marketing (ROAS) · Clientes · Biblioteca · Config
│     ├─ calendario.jsx     # Calendario operativo unificado
│     ├─ cadencias.jsx      # Cadencias: reglas por etapa + próximo toque
│     ├─ reporte.jsx        # Reporte ejecutivo imprimible
│     ├─ lead_drawer.jsx    # Drawer de lead (ficha + avanzar etapa)
│     ├─ trip.jsx           # Plano Viaje: shell + Resumen + Accesos
│     └─ trip_tabs.jsx      # pestañas del viaje + ConfigViaje
├─ public/
│  ├─ data/backup-supabase.json          # dump real (referencia para mapear datos)
│  └─ legacy/app-actual-en-produccion.html  # app v1 (Alpine) de referencia
└─ standalone/              # misma app sin build (HTML + js/ + css/)
```

---

## Arquitectura de dos planos

- **Plano Negocio** (la casa): Hoy·El Puente · Ventas · Cadencias · Marketing · Bandeja ·
  Finanzas · Calendario · Viajes · Clientes · Biblioteca · Reporte · Configuración.
- **Plano Viaje** (al abrir una salida): Resumen (GO/NO-GO) · Accesos · Itinerario · Ruta ·
  Proveedores · Presupuesto · Reservas · Tareas · App cliente · Config.

Entidades: Lead · Cliente · Salida · Acceso · Proveedor · Cuota/Pago · Mensaje · Tarea ·
Campaña. El viaje es una **dimensión**, no un contenedor.

---

## Conectar datos reales (Supabase)

Todo sale de `window.BA`. El punto de conexión es **`BA.source`** (en `src/lib/data.js`):
hoy devuelve el mock; mañana, los `fetch` a tus RPCs/Edge functions. Ver **`SUPABASE.md`**
para el mapa completo vista → backend y el plan de migración incremental.

---

## Migrar a "TypeScript de verdad" (opcional, incremental)

El `tsconfig.json` ya está con `allowJs`. Para tipar de a poco:
1. Renombrá un archivo de vista a `.tsx` y agregá `import React from 'react'` explícito.
2. Tipá sus props y los shapes de `BA` (creá `src/types.ts` con `Salida`, `Lead`, etc.).
3. Reemplazá los `React.createElement(...)` por JSX si querés (opcional).
4. Pasá los componentes de `window.X` a `export`/`import` ES módulos cuando un archivo
   ya esté tipado, y sacá su entrada de `main.jsx`.

No hace falta hacer todo de una: el shell funciona con la mezcla.

---

## Estado

Completo y navegable: El Puente, Ventas (+kanban+lead drawer), Cadencias, Marketing
(ROAS editable), Bandeja (triage IA + WhatsApp por contraparte), Finanzas, Calendario,
Viajes, Reporte PDF, Plano Viaje (10 pestañas), Cmd-K con acciones, Tweaks, claro/oscuro,
mobile con barra inferior contextual.

> Nota: el repo Vite no se pudo ejecutar dentro del entorno donde se generó; la versión
> `standalone/` sí está verificada visualmente. Si `npm run dev` tira algún error de
> orden/alcance, es casi seguro un ajuste en `src/main.jsx` o `vite.config.js` (no en la
> lógica de las vistas). Ver `CLAUDE.md`.
