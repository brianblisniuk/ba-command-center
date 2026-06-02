// B&A Command Center — Vite entry.
// Imports run in order; each module is a side-effecting IIFE that attaches its
// components to `window`. Order matters: setup → data → primitives → views → app.
import './setup.js';            // sets window.React / window.ReactDOM (must be first)
import './styles/ds.css';

import './tweaks-panel.jsx';    // window.useTweaks, TweaksPanel, Tweak* controls

import './lib/data.js';         // window.BA  (datos + BA.source seam)
import './lib/trip_data.js';    // BA.tripData(salidaId)

import './components/icons.jsx';      // window.Icon, Spark, BarChart, Donut, Ring
import './components/components.jsx'; // window.Badge, Avatar, OccBar, SalidaCard, StatCard, CardHead

import './views/puente.jsx';        // window.Puente
import './views/views_ops.jsx';     // window.Viajes, Bandeja, Finanzas
import './views/views_sales.jsx';   // window.Ventas, Marketing, Clientes, Biblioteca, Configuracion
import './views/calendario.jsx';    // window.Calendario
import './views/cadencias.jsx';     // window.Cadencias
import './views/reporte.jsx';       // window.Reporte
import './views/lead_drawer.jsx';   // window.LeadDrawer
import './views/trip.jsx';          // window.Trip
import './views/trip_tabs.jsx';     // window.Itinerario, Ruta, ... ConfigViaje

import './app.jsx';                 // monta <App/> en #root (ReactDOM.createRoot)

// quitar el splash una vez montado
requestAnimationFrame(() => {
  const b = document.getElementById('boot');
  if (b) { b.style.opacity = '0'; setTimeout(() => b.remove(), 400); }
});
