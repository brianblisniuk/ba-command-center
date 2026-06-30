/* Pasaporte Negro · Hoy · El Puente (command center home) → window.Puente */
(function () {
  const { Icon, Spark, BarChart, Donut, Ring, StatCard, Badge, Avatar, SalidaCard, OccBar, CardHead, estadoMeta } = window;
  const { useState, useRef, useEffect } = React;

  // ---------- Copiloto ----------
  function Copiloto({ toast, nav, openTrip, openLead, openCompose }) {
    const [q, setQ] = useState('');
    const [convo, setConvo] = useState([]);
    const [typing, setTyping] = useState(false);
    const SUGGESTIONS = ['¿Cuánto tengo por cobrar este mes?', '¿Qué leads no toqué en 10 días?', '¿Qué viaje está más cerca de decidir?', '¿Qué accesos me faltan cerrar?'];
    function doAction(ac, ansText) {
      if (!ac) return;
      if (ac.tipo === 'navegar' && ac.ref) nav(ac.ref);
      else if (ac.tipo === 'viaje' && ac.ref) openTrip(ac.ref);
      else if (ac.tipo === 'lead' && ac.ref) { openLead ? openLead(ac.ref) : nav('ventas'); }
      else if (ac.tipo === 'finanzas') nav('finanzas');
      else if (ac.tipo === 'redactar') { openCompose ? openCompose({ to: ac.ref || '', account: 'reservas', subject: '', body: ansText || '' }) : nav('bandeja'); }
      else nav('bandeja');
    }
    function ask(text) {
      if (!text.trim() || typing) return;
      setQ('');
      const history = convo.flatMap(t => [{ role: 'user', content: t.q }, { role: 'assistant', content: t.a || '' }]);
      setConvo(c => c.concat([{ q: text, a: null, acciones: [] }]));
      setTyping(true);
      Promise.resolve(BA.source.copiloto(text, history)).then(r => {
        setTyping(false);
        setConvo(c => c.map((t, i) => i === c.length - 1 ? { q: t.q, a: (r && r.respuesta) || 'No pude procesar eso ahora.', acciones: (r && r.acciones) || [] } : t));
      });
    }
    function html(s) {
      s = (s || '')
        .replace(/^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/gm, '')
        .replace(/^\s*\|(.+?)\|\s*$/gm, function (m, r) { return r.split('|').map(function (x) { return x.trim(); }).filter(Boolean).join('  ·  '); })
        .replace(/^#{1,6}\s+/gm, '');
      s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>');
      return { __html: s };
    }

    return React.createElement('div', { className: 'copilot rise' },
      React.createElement('div', { className: 'copilot-head' },
        React.createElement('div', { className: 'copilot-orb' }, React.createElement(Icon, { name: 'spark' })),
        React.createElement('div', null,
          React.createElement('div', { className: 'copilot-title' }, 'Preguntale a ', React.createElement('em', null, 'Pasaporte Negro')),
          React.createElement('div', { className: 'copilot-sub' }, 'Copiloto · Claude Sonnet sobre todo el negocio'))
      ),
      React.createElement('div', { className: 'copilot-body' },
        React.createElement('div', { className: 'copilot-input' },
          React.createElement('input', { value: q, placeholder: convo.length ? 'Seguí preguntando…' : '¿Cuánto tengo por cobrar este mes?',
            onChange: e => setQ(e.target.value), disabled: typing,
            onKeyDown: e => { if (e.key === 'Enter') ask(q); } }),
          React.createElement('button', { onClick: () => ask(q), disabled: typing }, React.createElement(Icon, { name: 'send' }))
        ),
        convo.length === 0 && React.createElement('div', { className: 'copilot-chips' },
          SUGGESTIONS.map((s, i) => React.createElement('button', { key: i, className: 'copilot-chip', onClick: () => ask(s) }, s))),
        convo.map((turn, i) => React.createElement('div', { key: i, style: { marginTop: 14 } },
          React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-3)', fontWeight: 600, marginBottom: 7 } }, '› ' + turn.q),
          turn.a == null
            ? React.createElement('div', { className: 'copilot-answer' }, React.createElement('span', { className: 'typing' }, React.createElement('i'), React.createElement('i'), React.createElement('i')))
            : React.createElement('div', { className: 'copilot-answer rise' },
                React.createElement('div', { dangerouslySetInnerHTML: html(turn.a) }),
                turn.acciones && turn.acciones.length > 0 && React.createElement('div', { className: 'ans-chips' },
                  turn.acciones.map((ac, j) => React.createElement('button', { key: j, className: j ? 'ghost' : '',
                    onClick: () => doAction(ac, turn.a) }, ac.label)))))),
        convo.length > 0 && !typing && React.createElement('button', { className: 'copilot-chip', style: { marginTop: 12 }, onClick: () => { setConvo([]); setQ(''); } }, 'Nueva conversación')
      )
    );
  }

  // ---------- Cola del día ----------
  function ColaDelDia({ toast, nav, openTrip }) {
    const [items, setItems] = useState(window.BA.puente.map(p => ({ ...p, done: false })));
    function resolve(id, label) {
      setItems(s => s.map(it => it.id === id ? { ...it, done: true } : it));
      toast(label + ' ✓');
    }
    function snooze(id) { setItems(s => s.map(it => it.id === id ? { ...it, done: true, snoozed: true } : it)); toast('Pospuesto a mañana'); }
    const pend = items.filter(i => !i.done).length;
    return React.createElement('div', { className: 'card pad rise' },
      React.createElement(CardHead, { title: 'Cola del día', count: pend + ' pendientes',
        right: React.createElement('span', { className: 'eyebrow' }, 'daily-brief · vivo') }),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 9 } },
        items.map(it => React.createElement('div', { key: it.id, className: 'qitem' + (it.done ? ' done' : '') },
          React.createElement('div', { className: 'q-ic ' + it.sev }, React.createElement(Icon, { name: it.icon })),
          React.createElement('div', { className: 'q-body' },
            React.createElement('div', { className: 'q-title' }, it.titulo),
            React.createElement('div', { className: 'q-meta' }, it.meta)),
          React.createElement('div', { className: 'q-side' },
            it.done
              ? React.createElement('span', { className: 'tag' }, React.createElement(Icon, { name: it.snoozed ? 'clock' : 'check' }), it.snoozed ? 'Pospuesto' : 'Hecho')
              : React.createElement(React.Fragment, null,
                  React.createElement('button', { className: 'btn sm primary', onClick: () => { toast(it.accion); if (it.tipo === 'cobro') nav('finanzas'); else if (it.tipo === 'gonogo') openTrip(it.salida); else nav('ventas'); } }, it.accion),
                  React.createElement('button', { className: 'btn sm ghost', title: 'Posponer', onClick: () => snooze(it.id), style: { padding: '5px 8px' } }, React.createElement(Icon, { name: 'clock' }))
                )
          )
        ))
      )
    );
  }

  // ---------- Decisiones GO/NO-GO ----------
  function GoNoGo({ openTrip }) {
    const decis = window.BA.salidas.filter(s => ['risk', 'go', 'opcion'].includes(s.estado) && s.dias > 0)
      .sort((a, b) => a.dias - b.dias).slice(0, 3);
    return React.createElement('div', { className: 'card pad rise' },
      React.createElement(CardHead, { title: 'Decisiones GO/NO-GO' }),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
        decis.map(s => {
          const beOk = s.conf >= s.breakeven;
          const accOk = s.accesosOk >= 2;
          const ready = beOk && accOk;
          const col = ready ? 'var(--go)' : (s.dias <= 7 ? 'var(--bad)' : 'var(--brass)');
          return React.createElement('div', { key: s.id, className: 'gonogo', style: { cursor: 'pointer' }, onClick: () => openTrip(s.id) },
            React.createElement('div', { className: 'gng-ring' },
              React.createElement(Ring, { pct: s.readiness, size: 58, thick: 6, color: col }),
              React.createElement('div', { className: 'lab' }, s.readiness)),
            React.createElement('div', { className: 'gng-reasons' },
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 } },
                React.createElement('b', { style: { fontSize: 13, color: 'var(--text-1)' } }, s.region),
                React.createElement('span', { className: 'mono', style: { fontSize: 11, color: col, fontWeight: 700 } }, s.dias + 'd')),
              React.createElement('div', { className: 'gng-reason' },
                React.createElement('span', { className: 'chk ' + (beOk ? 'ok' : 'no') }, React.createElement(Icon, { name: beOk ? 'check' : 'x' })),
                'Break-even ' + s.conf + '/' + s.breakeven),
              React.createElement('div', { className: 'gng-reason' },
                React.createElement('span', { className: 'chk ' + (accOk ? 'ok' : 'no') }, React.createElement(Icon, { name: accOk ? 'check' : 'x' })),
                'Dos accesos ' + s.accesosOk + '/' + s.accesosTot)
            )
          );
        })
      )
    );
  }

  // ---------- Accesos en riesgo ----------
  function AccesosRiesgo({ nav }) {
    const acc = window.BA.accesos.filter(a => a.etapa !== 'confirmado').slice(0, 4);
    const et = { identificado: { c: 'ghost', t: 'Identificado' }, contactado: { c: 'curso', t: 'Contactado' }, negociando: { c: 'risk', t: 'Negociando' } };
    return React.createElement('div', { className: 'card pad rise' },
      React.createElement(CardHead, { title: 'Accesos en riesgo', onLink: () => nav('biblioteca'), linkLabel: 'Biblioteca' }),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 0 } },
        acc.map((a, i) => {
          const s = window.BA.salidaById(a.salida);
          const e = et[a.etapa] || et.identificado;
          return React.createElement('div', { key: i, className: 'row', style: { paddingTop: i ? 11 : 4 } },
            React.createElement('div', { className: 'q-ic risk', style: { width: 34, height: 34, borderRadius: 10 } }, React.createElement(Icon, { name: 'key' })),
            React.createElement('div', { style: { flex: 1, minWidth: 0 } },
              React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-1)' } }, a.nombre),
              React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)' } }, (s ? s.region + ' · ' : '') + 'deadline ' + a.deadline)),
            React.createElement('span', { className: 'badge ' + e.c }, e.t)
          );
        })
      )
    );
  }

  // ---------- Estado de salidas (semáforo) ----------
  function EstadoSalidas({ openTrip }) {
    const st = window.BA.estado.salidasActivas;
    const counts = [
      { k: 'go', label: 'GO', n: st.go, c: 'var(--go)' },
      { k: 'risk', label: 'En riesgo', n: st.risk, c: 'var(--brass)' },
      { k: 'opcion', label: 'En opción', n: st.opcion, c: 'var(--stone)' },
      { k: 'curso', label: 'En curso', n: st.curso, c: 'var(--curso)' },
    ];
    return React.createElement('div', { className: 'card pad rise' },
      React.createElement(CardHead, { title: 'Estado de salidas' }),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 } },
        counts.map(c => React.createElement('div', { key: c.k, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule)' } },
          React.createElement('span', { style: { width: 9, height: 9, borderRadius: 99, background: c.c } }),
          React.createElement('span', { className: 'figure', style: { fontSize: 22, color: 'var(--text-1)' } }, c.n),
          React.createElement('span', { style: { fontSize: 11.5, color: 'var(--text-3)' } }, c.label)
        ))
      ),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 0 } },
        window.BA.salidas.filter(s => s.estado !== 'opcion').slice(0, 4).map((s, i) =>
          React.createElement('div', { key: s.id, className: 'row click', style: { cursor: 'pointer', paddingTop: i ? 10 : 4 }, onClick: () => openTrip(s.id) },
            React.createElement('span', { style: { fontSize: 17, width: 22 } }, s.glyph),
            React.createElement('div', { style: { flex: 1, minWidth: 0 } },
              React.createElement('div', { style: { fontSize: 12.5, fontWeight: 600, color: 'var(--text-1)' } }, s.region),
              React.createElement('div', { style: { fontSize: 10.5, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)' } }, s.fecha)),
            React.createElement(Badge, { estado: s.estado })
          ))
      )
    );
  }

  // ---------- Mapa de salidas (world) ----------
  function WorldMap({ openTrip, cur }) {
    const [hover, setHover] = useState(null);
    const origin = { lat: -34.6, lng: -58.4 }; // Buenos Aires
    const px = ll => ({ x: ((ll.lng + 180) / 360) * 100, y: ((90 - ll.lat) / 180) * 100 });
    const o = px(origin);
    const sal = window.BA.salidas;
    function arc(a, b) {
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - Math.abs(a.x - b.x) * 0.18 - 6;
      return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
    }
    return React.createElement('div', { className: 'card pad rise' },
      React.createElement(CardHead, { title: 'Salidas en el mundo', count: sal.length + ' destinos',
        right: React.createElement('span', { className: 'eyebrow' }, 'origen · Buenos Aires') }),
      React.createElement('div', { className: 'worldmap' },
        React.createElement('svg', { viewBox: '0 0 100 50', preserveAspectRatio: 'none', style: { position: 'absolute', inset: 0 } },
          // graticule
          [10, 20, 30, 40].map(y => React.createElement('line', { key: 'h' + y, x1: 0, x2: 100, y1: y, y2: y, stroke: 'var(--rule-soft)', strokeWidth: 0.2 })),
          [12.5, 25, 37.5, 50, 62.5, 75, 87.5].map(x => React.createElement('line', { key: 'v' + x, x1: x, x2: x, y1: 0, y2: 50, stroke: 'var(--rule-soft)', strokeWidth: 0.2 })),
          // arcs
          sal.map(s => {
            const b = px(s); b.x = b.x / 1; b.y = b.y / 1;
            const B = { x: px(s).x, y: px(s).y };
            return React.createElement('path', { key: s.id, d: arc({ x: o.x, y: o.y }, B), fill: 'none',
              stroke: 'var(--brass)', strokeWidth: hover === s.id ? 0.7 : 0.35, opacity: hover === s.id ? 0.9 : 0.4, strokeDasharray: '1.2 1.2' });
          }),
          React.createElement('circle', { cx: o.x, cy: o.y, r: 1, fill: 'var(--text-1)' })
        ),
        sal.map(s => {
          const p = px(s); const m = estadoMeta(s.estado);
          const col = s.estado === 'go' ? 'var(--go)' : s.estado === 'risk' ? 'var(--brass)' : s.estado === 'curso' ? 'var(--curso)' : 'var(--stone)';
          return React.createElement('div', { key: s.id, className: 'wm-dot', style: { left: p.x + '%', top: p.y + '%', color: col },
            onMouseEnter: () => setHover(s.id), onMouseLeave: () => setHover(null), onClick: () => openTrip(s.id) },
            React.createElement('span', { className: 'ring' }),
            React.createElement('span', { className: 'pin', style: { background: col } })
          );
        }),
        hover && (() => { const s = window.BA.salidaById(hover); const p = px(s);
          return React.createElement('div', { className: 'wm-tip', style: { left: p.x + '%', top: p.y + '%' } }, s.region + ' · ' + estadoMeta(s.estado).label); })()
      ),
      React.createElement('div', { className: 'chart-legend', style: { marginTop: 14 } },
        [['GO', 'var(--go)'], ['En riesgo', 'var(--brass)'], ['En curso', 'var(--curso)'], ['En opción', 'var(--stone)']].map((l, i) =>
          React.createElement('span', { key: i, className: 'lg' }, React.createElement('i', { style: { background: l[1], borderRadius: 99 } }), l[0]))
      )
    );
  }

  // ---------- main ----------
  function Puente({ cur, op, toast, nav, openTrip, openLead, openCompose }) {
    const e = window.BA.estado;
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Buen día' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
    const M = v => window.BA.money(v * 1000, cur).replace(/\s?[\d.,]+/, m => m); // keep symbol
    function k(v) { return window.BA.sym[cur] + ' ' + Math.round(v * 1000 * (window.BA.fx[cur] / window.BA.fx.USD) / 1000) + 'k'; }

    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' },
        React.createElement('div', null,
          React.createElement('h1', null, React.createElement('span', { className: 'lt' }, greet + ', '), React.createElement('em', { className: 's' }, op.short)),
          React.createElement('div', { className: 'page-greet-sub' }, 'El puente · ',
            React.createElement('b', null, e.salidasActivas.go + e.salidasActivas.risk + e.salidasActivas.opcion + e.salidasActivas.curso + ' salidas activas'),
            ' · ', new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }))
        )
      ),
      // KPI row
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--gap)' } },
        React.createElement(StatCard, { icon: 'trending', iconCls: '', label: 'Forecast salidas', value: k(e.forecast.val), sub: e.salidasActivas.go + e.salidasActivas.risk + e.salidasActivas.opcion + e.salidasActivas.curso + ' salidas', delta: e.forecast.delta, spark: e.forecast.spark, sparkColor: 'var(--accent)' }),
        React.createElement(StatCard, { icon: 'wallet', iconCls: 'tint-bad', label: 'Por cobrar', value: k(e.caja.porCobrar), sub: k(e.caja.vencido) + ' vencido' }),
        React.createElement(StatCard, { icon: 'users', iconCls: 'tint', label: 'Butacas vs break-even', value: e.butacas.vendidas, unit: '/ ' + e.butacas.breakeven, sub: 'capacidad ' + e.butacas.capacidad }),
        React.createElement(StatCard, { icon: 'funnel', iconCls: 'tint-brass', label: 'Leads calientes', value: e.leadsCalientes, unit: 'sin atender', sub: 'pipeline US$ ' + (e.leadsCalientesPipeUSD || 0) + 'k' })
      ),
      // main two-column
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'minmax(0, 1.65fr) minmax(0, 1fr)', alignItems: 'start' } },
        React.createElement('div', { className: 'grid' },
          React.createElement(Copiloto, { toast, nav, openTrip, openLead, openCompose }),
          React.createElement(ColaDelDia, { toast, nav, openTrip })
        ),
        React.createElement('div', { className: 'grid' },
          React.createElement(GoNoGo, { openTrip }),
          React.createElement(AccesosRiesgo, { nav }),
          React.createElement(EstadoSalidas, { openTrip })
        )
      ),
      // world map
      React.createElement('div', { style: { marginTop: 'var(--gap)' } },
        React.createElement(WorldMap, { openTrip, cur })
      )
    );
  }

  window.Puente = Puente;
})();
