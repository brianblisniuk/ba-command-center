/* B&A · Command Center — app shell + routing + tweaks → mount */
(function () {
  const { Icon } = window;
  const { useState, useEffect, useRef } = React;
  const { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle } = window;
  const BA = window.BA;

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "dark": false,
    "density": "regular",
    "accent": "laurel",
    "currency": "USD",
    "operator": "brian"
  }/*EDITMODE-END*/;

  const NAV = [
    { sec: 'Inicio', items: [{ k: 'puente', t: 'Hoy · El Puente', icon: 'home' }, { k: 'reporte', t: 'Reporte ejecutivo', icon: 'download' }] },
    { sec: 'Comercial', items: [{ k: 'ventas', t: 'Ventas', icon: 'funnel' }, { k: 'cadencias', t: 'Cadencias', icon: 'send' }, { k: 'marketing', t: 'Marketing', icon: 'megaphone' }] },
    { sec: 'Operación', items: [{ k: 'bandeja', t: 'Bandeja', icon: 'mail', badge: 'unread' }, { k: 'finanzas', t: 'Finanzas', icon: 'coin' }, { k: 'calendario', t: 'Calendario', icon: 'calendar' }] },
    { sec: 'Portafolio', items: [{ k: 'viajes', t: 'Viajes', icon: 'compass' }, { k: 'clientes', t: 'Clientes', icon: 'users' }, { k: 'biblioteca', t: 'Biblioteca', icon: 'book' }] },
    { sec: '', items: [{ k: 'config', t: 'Configuración', icon: 'settings' }] },
  ];

  const VIEWS = {
    puente: 'Puente', ventas: 'Ventas', marketing: 'Marketing', bandeja: 'Bandeja',
    finanzas: 'Finanzas', viajes: 'Viajes', clientes: 'Clientes', biblioteca: 'Biblioteca', config: 'Configuracion', calendario: 'Calendario', cadencias: 'Cadencias', reporte: 'Reporte',
  };

  // ---------- Command palette ----------
  function CommandK({ onClose, nav, openTrip, toast, openLead }) {
    const [q, setQ] = useState('');
    const ref = useRef(null);
    useEffect(() => { ref.current && ref.current.focus(); }, []);
    const items = BA.cmd.filter(c => !q || (c.t + ' ' + c.s).toLowerCase().includes(q.toLowerCase()));
    const groups = { nav: [], trip: [], lead: [], action: [] };
    items.forEach(c => (groups[c.kind] || groups.action).push(c));
    const order = [['nav', 'Ir a'], ['trip', 'Salidas'], ['lead', 'Personas'], ['action', 'Acciones']];
    function pick(c) {
      onClose();
      if (c.kind === 'nav') nav(c.view);
      else if (c.kind === 'trip') openTrip(c.tripId);
      else if (c.kind === 'lead' && c.leadId && openLead) openLead(c.leadId);
      else if (c.kind === 'action') {
        if (c.act === 'pay') { toast('Familia Mehta · marcado pagado ✓'); nav('finanzas'); }
        else if (c.act === 'remind') { toast('Recordatorios preparados (3) ✓'); nav('finanzas'); }
        else if (c.act === 'reply') { toast('Borradores IA listos para revisar'); nav('bandeja'); }
        else if (c.act === 'newtrip') { toast('Nueva salida'); nav('viajes'); }
        else toast(c.t);
      }
      else toast(c.t);
    }
    function onKey(e) { if (e.key === 'Escape') onClose(); if (e.key === 'Enter' && items[0]) pick(items[0]); }
    return React.createElement('div', { className: 'cmdk-overlay', onClick: onClose },
      React.createElement('div', { className: 'cmdk', onClick: e => e.stopPropagation() },
        React.createElement('div', { className: 'cmdk-in' },
          React.createElement(Icon, { name: 'search' }),
          React.createElement('input', { ref, value: q, placeholder: 'Buscar salida, lead, proveedor o acción…', onChange: e => setQ(e.target.value), onKeyDown: onKey }),
          React.createElement('span', { className: 'tb-kbd' }, 'ESC')),
        React.createElement('div', { className: 'cmdk-list' },
          order.map(([key, label]) => groups[key].length > 0 && React.createElement('div', { key },
            React.createElement('div', { className: 'cmdk-sec' }, label),
            groups[key].map((c, i) => React.createElement('div', { key: i, className: 'cmdk-item', onClick: () => pick(c) },
              React.createElement('div', { className: 'cic' }, React.createElement(Icon, { name: c.icon || (c.kind === 'trip' ? 'compass' : c.kind === 'lead' ? 'users' : 'cr') })),
              React.createElement('div', { className: 'ct' },
                React.createElement('div', { className: 't' }, c.t),
                React.createElement('div', { className: 's' }, c.s)),
              React.createElement('span', { className: 'kbd' }, '↵')))
          )),
          items.length === 0 && React.createElement('div', { className: 'cmdk-sec', style: { padding: 20 } }, 'Sin resultados')
        )
      )
    );
  }

  // ---------- Conexión a Supabase (estado + login de operador) ----------
  function ConnectControl({ toast }) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState('');
    const mode = BA.live.mode;
    const dotColor = mode === 'live' ? 'var(--go)' : mode === 'connecting' ? 'var(--brass)' : 'var(--text-faint)';
    const label = mode === 'live' ? 'En vivo' : mode === 'connecting' ? 'Conectando…' : 'Demo';
    async function submit() {
      if (busy) return;
      setBusy(true); setErr('');
      const r = await BA.connect(email, pwd);
      setBusy(false);
      if (r && r.ok) { setOpen(false); setPwd(''); toast('Conectado a Supabase ✓'); }
      else setErr((r && r.error) || 'No se pudo conectar');
    }
    return React.createElement('div', { style: { position: 'relative' } },
      React.createElement('button', { className: 'tb-sync', onClick: () => setOpen(v => !v), title: 'Estado de datos', style: { cursor: 'pointer' } },
        React.createElement('span', { className: 'd', style: { background: dotColor } }), label),
      open && React.createElement('div', { style: { position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 270, background: 'var(--surface)', border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-lg)', padding: 16, zIndex: 60 } },
        mode === 'live'
          ? React.createElement('div', null,
              React.createElement('div', { className: 'eyebrow', style: { marginBottom: 6 } }, 'Conectado a Supabase'),
              React.createElement('div', { style: { fontSize: 13, color: 'var(--text-1)', marginBottom: 12, wordBreak: 'break-all' } }, BA.live.operator || 'operador'),
              React.createElement('button', { className: 'btn sm', style: { width: '100%' }, onClick: () => BA.disconnect() }, 'Salir'))
          : React.createElement('div', null,
              React.createElement('div', { className: 'eyebrow', style: { marginBottom: 8 } }, 'Conectar · operador'),
              React.createElement('input', { type: 'email', value: email, placeholder: 'email', autoComplete: 'username', onChange: e => setEmail(e.target.value),
                style: { width: '100%', padding: '8px 10px', marginBottom: 8, borderRadius: 'var(--radius-xs)', border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13 } }),
              React.createElement('input', { type: 'password', value: pwd, placeholder: 'contraseña', autoComplete: 'current-password', onKeyDown: e => { if (e.key === 'Enter') submit(); }, onChange: e => setPwd(e.target.value),
                style: { width: '100%', padding: '8px 10px', marginBottom: 10, borderRadius: 'var(--radius-xs)', border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13 } }),
              err && React.createElement('div', { style: { fontSize: 11.5, color: 'var(--bad)', marginBottom: 8 } }, err),
              React.createElement('button', { className: 'btn sm primary', style: { width: '100%' }, disabled: busy, onClick: submit }, busy ? 'Conectando…' : 'Entrar'),
              React.createElement('div', { style: { fontSize: 10.5, color: 'var(--text-faint)', marginTop: 8, lineHeight: 1.4 } }, 'Sin conexión, ves datos de demostración.'))
      )
    );
  }

  function App() {
    const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
    const [view, setView] = useState('puente');
    const [tripId, setTripId] = useState(null);
    const [tripTab, setTripTab] = useState('Resumen');
    const [lastDomain, setLastDomain] = useState('puente');
    const [cmdk, setCmdk] = useState(false);
    const [railOpen, setRailOpen] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [leadId, setLeadId] = useState(null);
    const [rev, setRev] = useState(0);
    const scrollRef = useRef(null);

    useEffect(() => {
      const r = document.documentElement;
      r.setAttribute('data-theme', t.dark ? 'dark' : 'light');
      r.setAttribute('data-density', t.density === 'compact' ? 'compact' : 'regular');
      r.setAttribute('data-accent', t.accent === 'brass' ? 'brass' : 'laurel');
    }, [t.dark, t.density, t.accent]);

    useEffect(() => {
      function onKey(e) {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmdk(v => !v); }
      }
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
      const onData = () => setRev(r => r + 1);
      window.addEventListener('ba:datachanged', onData);
      return () => window.removeEventListener('ba:datachanged', onData);
    }, []);

    useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [view, tripId]);

    const op = BA.operadores.find(o => o.id === t.operator) || BA.operadores[0];
    const cur = t.currency || 'USD';
    function toast(msg) { const id = Date.now() + Math.random(); setToasts(s => [...s, { id, msg }]); setTimeout(() => setToasts(s => s.filter(x => x.id !== id)), 2600); }
    function nav(v) { setView(v); setTripId(null); setLastDomain(v); setRailOpen(false); }
    function openTrip(id) { setLastDomain(view === 'trip' ? lastDomain : view); setTripId(id); setTripTab('Resumen'); setView('trip'); setRailOpen(false); }
    function back() { setView(lastDomain || 'viajes'); setTripId(null); }
    function openLead(id) { setLeadId(id); }

    const unread = BA.bandeja.filter(m => !m.leido).length;

    // current view component
    let body;
    if (view === 'trip') body = React.createElement(window.Trip, { tripId, cur, toast, back, tab: tripTab, setTab: setTripTab, openLead });
    else {
      const C = window[VIEWS[view]] || window.Puente;
      body = React.createElement(C, { cur, op, toast, nav, openTrip, openLead, rev });
    }

    return React.createElement('div', { className: 'app' + (railOpen ? '' : '') },
      // ===== sidebar =====
      React.createElement('aside', { className: 'sidebar' + (railOpen ? ' open' : '') },
        React.createElement('div', { className: 'sb-brand' },
          React.createElement('div', { className: 'sb-logo' }, 'B'),
          React.createElement('div', { className: 'sb-brand-txt' },
            React.createElement('div', { className: 'sb-brand-name' }, 'Blisniuk ', React.createElement('em', null, '& '), 'Amanov'),
            React.createElement('div', { className: 'sb-brand-sub' }, 'Command Center'))),
        React.createElement('nav', { className: 'sb-nav' },
          NAV.map((g, gi) => React.createElement('div', { key: gi },
            g.sec && React.createElement('div', { className: 'sb-sec-label' }, g.sec),
            g.items.map(it => {
              const active = (view === it.k) || (view === 'trip' && it.k === 'viajes');
              return React.createElement('button', { key: it.k, className: 'sb-item' + (active ? ' active' : ''), onClick: () => nav(it.k) },
                React.createElement(Icon, { name: it.icon }),
                React.createElement('span', { className: 'sb-item-label' }, it.t),
                it.badge === 'unread' && unread > 0 && React.createElement('span', { className: 'sb-badge' }, unread));
            })
          ))
        ),
        React.createElement('div', { className: 'sb-foot' },
          React.createElement('div', { className: 'sb-id', onClick: () => setTweak('operator', t.operator === 'brian' ? 'fede' : 'brian') },
            React.createElement('div', { className: 'sb-id-av', style: { background: 'linear-gradient(150deg,' + op.color + ',#1F2E20)' } }, op.initials),
            React.createElement('div', { className: 'sb-id-txt' },
              React.createElement('div', { className: 'sb-id-name' }, op.name),
              React.createElement('div', { className: 'sb-id-role' }, op.role + ' · cambiar')),
            React.createElement(Icon, { name: 'refresh', style: { width: 15, height: 15, color: 'var(--on-sidebar-mute)' } }))
        )
      ),
      // ===== main =====
      React.createElement('div', { className: 'main' },
        React.createElement('header', { className: 'topbar' },
          React.createElement('button', { className: 'tb-toggle', onClick: () => setRailOpen(v => !v), title: 'Menú' }, React.createElement(Icon, { name: 'menu' })),
          React.createElement('div', { className: 'tb-search', onClick: () => setCmdk(true) },
            React.createElement(Icon, { name: 'search' }),
            React.createElement('span', { className: 'tb-search-txt' }, 'Buscar o ejecutar…'),
            React.createElement('span', { className: 'tb-kbd' }, '⌘K')),
          React.createElement('div', { className: 'tb-spacer' }),
          React.createElement('div', { className: 'tb-actions' },
            React.createElement(ConnectControl, { toast }),
            React.createElement('div', { className: 'tb-seg' },
              ['EUR', 'USD', 'ARS'].map(c => React.createElement('button', { key: c, className: cur === c ? 'on' : '', onClick: () => setTweak('currency', c) }, c))),
            React.createElement('button', { className: 'tb-icon', title: 'Tema', onClick: () => setTweak('dark', !t.dark) }, React.createElement(Icon, { name: t.dark ? 'sun' : 'moon' })),
            React.createElement('button', { className: 'tb-icon', title: 'Ajustes · densidad y acento', onClick: () => window.postMessage({ type: '__activate_edit_mode' }, '*') }, React.createElement(Icon, { name: 'sliders' })),
            React.createElement('button', { className: 'tb-icon', title: 'Notificaciones' }, React.createElement(Icon, { name: 'bell' }), React.createElement('span', { className: 'dot' })),
            React.createElement('div', { className: 'sb-id-av', style: { width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(150deg,' + op.color + ',#1F2E20)', cursor: 'pointer' }, title: op.name, onClick: () => setTweak('operator', t.operator === 'brian' ? 'fede' : 'brian') }, op.initials)
          )
        ),
        React.createElement('main', { className: 'content', ref: scrollRef, key: view + (tripId || '') + ':' + rev }, body)
      ),
      // ===== mobile contextual bottom nav =====
      React.createElement('nav', { className: 'bottomnav' },
        view === 'trip'
          ? [{ k: 'back', icon: 'cl', l: 'Volver' }, { k: 'Resumen', icon: 'home', l: 'Resumen' }, { k: 'Accesos', icon: 'key', l: 'Accesos' }, { k: 'Itinerario', icon: 'list', l: 'Itin.' }, { k: 'Reservas', icon: 'funnel', l: 'Reservas' }]
            .map(it => React.createElement('button', { key: it.k, className: 'bn-item' + (it.k === 'back' ? ' back' : tripTab === it.k ? ' active' : ''), onClick: () => it.k === 'back' ? back() : setTripTab(it.k) },
              React.createElement(Icon, { name: it.icon }), React.createElement('span', { className: 'l' }, it.l)))
          : [{ k: 'puente', icon: 'home', l: 'Hoy' }, { k: 'ventas', icon: 'funnel', l: 'Ventas' }, { k: 'bandeja', icon: 'mail', l: 'Bandeja', badge: unread }, { k: 'finanzas', icon: 'coin', l: 'Caja' }, { k: 'viajes', icon: 'compass', l: 'Viajes' }]
            .map(it => React.createElement('button', { key: it.k, className: 'bn-item' + (view === it.k ? ' active' : ''), onClick: () => nav(it.k) },
              React.createElement(Icon, { name: it.icon }),
              it.badge > 0 && React.createElement('span', { className: 'bn-badge' }, it.badge),
              React.createElement('span', { className: 'l' }, it.l)))
      ),
      // ===== overlays =====
      cmdk && React.createElement(CommandK, { onClose: () => setCmdk(false), nav, openTrip, toast, openLead: (id) => { setCmdk(false); setLeadId(id); } }),
      leadId && React.createElement(window.LeadDrawer, { leadId, onClose: () => setLeadId(null), toast, nav: (v) => { setLeadId(null); nav(v); }, openTrip: (id) => { setLeadId(null); openTrip(id); }, onMutate: () => setRev(r => r + 1) }),
      railOpen && window.innerWidth <= 1100 && React.createElement('div', { onClick: () => setRailOpen(false), style: { position: 'fixed', inset: 0, zIndex: 25, background: 'rgba(0,0,0,.3)' } }),
      // toasts
      React.createElement('div', { className: 'toast-wrap' },
        toasts.map(t2 => React.createElement('div', { key: t2.id, className: 'toast' },
          React.createElement('span', { className: 'ti' }, React.createElement(Icon, { name: 'check' })), t2.msg))),
      // tweaks
      React.createElement(TweaksPanel, null,
        React.createElement(TweakSection, { label: 'Apariencia' }),
        React.createElement(TweakToggle, { label: 'Oscuro', value: t.dark, onChange: v => setTweak('dark', v) }),
        React.createElement(TweakRadio, { label: 'Densidad', value: t.density, options: ['regular', 'compact'], onChange: v => setTweak('density', v) }),
        React.createElement(TweakRadio, { label: 'Acento', value: t.accent, options: ['laurel', 'brass'], onChange: v => setTweak('accent', v) }),
        React.createElement(TweakSection, { label: 'Operación' }),
        React.createElement(TweakRadio, { label: 'Moneda', value: cur, options: ['EUR', 'USD', 'ARS'], onChange: v => setTweak('currency', v) }),
        React.createElement(TweakRadio, { label: 'Identidad', value: t.operator, options: ['brian', 'fede'], onChange: v => setTweak('operator', v) })
      )
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
})();
