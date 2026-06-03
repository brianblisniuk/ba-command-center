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
    { sec: 'Portafolio', items: [{ k: 'viajes', t: 'Viajes', icon: 'compass' }, { k: 'clientes', t: 'Clientes', icon: 'users' }, { k: 'biblioteca', t: 'Biblioteca', icon: 'book' }, { k: 'historial', t: 'Historial', icon: 'refresh' }] },
    { sec: '', items: [{ k: 'config', t: 'Configuración', icon: 'settings' }] },
  ];

  const VIEWS = {
    puente: 'Puente', ventas: 'Ventas', marketing: 'Marketing', bandeja: 'Bandeja',
    finanzas: 'Finanzas', viajes: 'Viajes', clientes: 'Clientes', biblioteca: 'Biblioteca', config: 'Configuracion', calendario: 'Calendario', cadencias: 'Cadencias', reporte: 'Reporte', historial: 'Historial',
  };

  // ---------- Command palette ----------
  function CommandK({ onClose, nav, openTrip, toast, openLead, openWizard, openCapture }) {
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
        else if (c.act === 'newtrip') { openWizard ? openWizard() : nav('viajes'); }
        else if (c.act === 'capture') { openCapture && openCapture(); }
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
    const [provId, setProvId] = useState(null);
    const [rev, setRev] = useState(0);
    const [authed, setAuthed] = useState(false);
    const [live, setLive] = useState(false);
    const [wizard, setWizard] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [capture, setCapture] = useState(false);
    const [proposal, setProposal] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
      let sub;
      (async () => {
        const s = await BA.source.getSession();
        if (s) { try { await BA.source.hydrateTrips(); } catch (e) {} setAuthed(true); setLive(true); }
        if (window.SB) {
          const r = window.SB.auth.onAuthStateChange((_e, sess) => { setLive(!!sess); if (!sess) setAuthed(false); });
          sub = r && r.data ? r.data.subscription : null;
        }
      })();
      return () => { if (sub) sub.unsubscribe(); };
    }, []);

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

    useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [view, tripId, leadId, provId]);

    const op = BA.operadores.find(o => o.id === t.operator) || BA.operadores[0];
    const cur = t.currency || 'USD';
    function toast(msg) { const id = Date.now() + Math.random(); setToasts(s => [...s, { id, msg }]); setTimeout(() => setToasts(s => s.filter(x => x.id !== id)), 2600); }
    function nav(v) { setView(v); setTripId(null); setLeadId(null); setProvId(null); setLastDomain(v); setRailOpen(false); }
    function openTrip(id) { setLastDomain(['trip','lead','provider'].includes(view) ? lastDomain : view); setTripId(id); setTripTab('Resumen'); setView('trip'); setLeadId(null); setProvId(null); setRailOpen(false); }
    function back() { setView(lastDomain || 'viajes'); setTripId(null); setLeadId(null); setProvId(null); }
    function openLead(id) { setLastDomain(['trip','lead','provider'].includes(view) ? lastDomain : view); setLeadId(id); setProvId(null); setView('lead'); setRailOpen(false); }
    function openProvider(id) { setLastDomain(['trip','lead','provider'].includes(view) ? lastDomain : view); setProvId(id); setLeadId(null); setView('provider'); setRailOpen(false); }

    const unread = BA.bandeja.filter(m => !m.leido).length;

    // current view component
    let body;
    if (view === 'trip') body = React.createElement(window.Trip, { tripId, cur, toast, back, tab: tripTab, setTab: setTripTab, openLead, openProvider, op });
    else if (view === 'lead') body = React.createElement(window.LeadDetail, { leadId, cur, toast, back, openTrip, openProvider, op, openProposal: (l) => setProposal(l) });
    else if (view === 'provider') body = React.createElement(window.ProviderDetail, { providerId: provId, cur, toast, back, openTrip, op });
    else {
      const C = window[VIEWS[view]] || window.Puente;
      body = React.createElement(C, { cur, op, toast, nav, openTrip, openLead, openProvider, openWizard: () => setWizard(true), openCapture: () => setCapture(true), rev });
    }

    if (!authed) return React.createElement(window.Auth, { onEnter: async (id) => { setTweak('operator', id); try { await BA.source.hydrateTrips(); } catch (e) {} setRev(r => r + 1); setAuthed(true); setLive(true); } });

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
            React.createElement('div', { className: 'tb-sync', title: live ? 'Conectado a Supabase (datos reales en lo cableado)' : 'Modo demo (sin sesión)' }, React.createElement('span', { className: 'd', style: { background: live ? '#3D7A4E' : '#B8945A' } }), live ? 'EN VIVO' : 'DEMO'),
            React.createElement('div', { className: 'tb-seg' },
              ['EUR', 'USD', 'ARS'].map(c => React.createElement('button', { key: c, className: cur === c ? 'on' : '', onClick: () => setTweak('currency', c) }, c))),
            React.createElement('button', { className: 'tb-icon', title: 'Nueva salida', onClick: () => setWizard(true) }, React.createElement(Icon, { name: 'plus' })),
            React.createElement('button', { className: 'tb-icon', title: 'Tema', onClick: () => setTweak('dark', !t.dark) }, React.createElement(Icon, { name: t.dark ? 'sun' : 'moon' })),
            React.createElement('button', { className: 'tb-icon', title: 'Notificaciones', onClick: () => setNotifOpen(v => !v) }, React.createElement(Icon, { name: 'bell' }), window.unreadNotifs(op.id) > 0 && React.createElement('span', { className: 'dot' })),
            React.createElement('div', { className: 'sb-id-av', style: { width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(150deg,' + op.color + ',#1F2E20)', cursor: 'pointer' }, title: op.name, onClick: () => setTweak('operator', t.operator === 'brian' ? 'fede' : 'brian') }, op.initials)
          )
        ),
        React.createElement('main', { className: 'content', ref: scrollRef, key: view + (tripId || leadId || provId || '') }, body)
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
      cmdk && React.createElement(CommandK, { onClose: () => setCmdk(false), nav, openTrip, toast, openLead: (id) => { setCmdk(false); openLead(id); }, openWizard: () => { setCmdk(false); setWizard(true); }, openCapture: () => { setCmdk(false); setCapture(true); } }),
      wizard && React.createElement(window.NewTripWizard, { onClose: () => setWizard(false), toast, op }),
      capture && React.createElement(window.AICapture, { onClose: () => setCapture(false), toast, nav }),
      proposal && React.createElement(window.Propuesta, { lead: proposal, onClose: () => setProposal(null), toast }),
      notifOpen && React.createElement(window.NotifCenter, { op, toast, onClose: () => setNotifOpen(false),
        onGo: (n) => { const c = n.ctx || ''; if (c.startsWith('prov:')) openProvider(c.slice(5)); else if (['nam','pie','uzb','jpn'].includes(c)) openTrip(c); else if (c === 'finanzas') nav('finanzas'); else if (c.startsWith('task:') || c.startsWith('slot:')) openTrip('pie'); else toast(n.t); } }),
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
