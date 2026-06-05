// F-2: entry único para Vite. Importa cada módulo por su efecto secundario
// (cada uno registra en window.X), respetando EXACTAMENTE el orden de carga
// que tenían los <script> en index.html. globals.js va primero.
import './globals.js';

// Capa de datos (plano, sin JSX) — setea window.SB, window.BA, etc.
import '../js/data.js';
import '../js/data_ext.js';
import '../js/trip_data.js';

// Componentes y vistas (JSX; React lo inyecta vite.config jsxInject).
import '../tweaks-panel.jsx';
import '../js/icons.jsx';
import '../js/components.jsx';
import '../js/onboarding.jsx';
import '../js/collab.jsx';
import '../js/puente.jsx';
import '../js/views_ops.jsx';
import '../js/views_sales.jsx';
import '../js/views_v2.jsx';
import '../js/config.jsx';
import '../js/calendario.jsx';
import '../js/cadencias.jsx';
import '../js/reporte.jsx';
import '../js/detail.jsx';
import '../js/trip_tabs.jsx';
import '../js/trip_tabs2.jsx';
import '../js/proveedores.jsx';
import '../js/extras.jsx';
import '../js/trip.jsx';
import '../js/ia.jsx';
import '../js/composer.jsx';
import '../js/editorial.jsx';
import '../js/app.jsx'; // monta la app (ReactDOM.createRoot)

// Splash: oculta el boot una vez que React montó.
(function () {
  let tries = 0;
  const iv = setInterval(() => {
    tries++;
    const root = document.getElementById('root');
    if ((root && root.childElementCount > 0) || tries > 40) {
      const b = document.getElementById('boot');
      if (b) { b.classList.add('gone'); setTimeout(() => b.remove(), 450); }
      clearInterval(iv);
    }
  }, 100);
})();
