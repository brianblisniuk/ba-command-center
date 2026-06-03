/* B&A · dominios: Ventas · Marketing · Clientes · Biblioteca · Config → window */
(function () {
  const { Icon, Donut, StatCard, Badge, Avatar, CardHead } = window;
  const { useState } = React;
  const BA = window.BA;
  function k(v, cur) { return BA.sym[cur] + ' ' + Math.round(v * (BA.fx[cur] / BA.fx.USD)) + 'k'; }
  function stub(title, sub, icon) {
    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' }, React.createElement('div', null,
        React.createElement('h1', null, React.createElement('span', { className: 'lt' }, title)),
        React.createElement('div', { className: 'page-greet-sub' }, sub))),
      React.createElement('div', { className: 'card' }, React.createElement('div', { className: 'stub' },
        React.createElement('div', { className: 'ic' }, React.createElement(Icon, { name: icon })),
        React.createElement('h3', null, title),
        React.createElement('p', null, sub + ' — vista incluida en el shell; la diseñamos en detalle en la próxima iteración.')))
    );
  }

  // ============ VENTAS ============
  function Ventas({ cur, toast, openTrip, openLead }) {
    const [drag, setDrag] = useState(null);
    const [, force] = useState(0);
    const STAGES = BA.STAGES;
    const fn = STAGES.map(st => { const ls = BA.leads.filter(l => l.stageKey === st.key); return { key: st.key, etapa: st.label, color: st.color, n: ls.length, valUSD: Math.round(ls.reduce((a, l) => a + (l.potUSD || 0), 0)) }; });
    const maxN = Math.max(1, ...fn.map(f => f.n));
    const totalPot = BA.leads.reduce((s, l) => s + (l.potUSD || 0), 0);
    const enfriando = BA.leads.filter(l => l.dias > 10 && l.stageKey !== 'booked' && l.stageKey !== 'lost').length;
    function onDrop(stageKey) {
      const id = drag; setDrag(null);
      if (!id) return;
      const l = BA.leads.find(x => x.id === id);
      if (!l || l.stageKey === stageKey) return;
      const prevK = l.stageKey, prevL = l.etapa, st = STAGES.find(s => s.key === stageKey);
      l.stageKey = stageKey; l.etapa = st ? st.label : l.etapa; force(x => x + 1);
      Promise.resolve(BA.source.leadChangeStage(id, stageKey)).then(r => {
        if (r && r.error) { l.stageKey = prevK; l.etapa = prevL; force(x => x + 1); toast('No se pudo mover: ' + r.error); }
        else { toast(l.nombre + ' → ' + (st ? st.label : stageKey)); }
      });
    }
    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' }, React.createElement('div', null,
        React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Ventas')),
        React.createElement('div', { className: 'page-greet-sub' }, 'Pipeline completo · todas las salidas · una sola data, varias lentes'))),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
        React.createElement(StatCard, { icon: 'funnel', iconCls: '', label: 'Leads activos', value: BA.leads.length, sub: 'en pipeline', delta: 8 }),
        React.createElement(StatCard, { icon: 'coin', iconCls: 'tint', label: 'Potencial', value: k(totalPot, cur), sub: 'valor del pipeline' }),
        React.createElement(StatCard, { icon: 'target', iconCls: 'tint-brass', label: 'Conversión', value: '26%', sub: 'lead → reserva', delta: 3 }),
        React.createElement(StatCard, { icon: 'snow', iconCls: 'tint-bad', label: 'Enfriándose', value: enfriando, sub: '+10 días sin tocar' })
      ),
      // funnel
      React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
        React.createElement(CardHead, { title: 'Embudo', right: React.createElement('span', { className: 'eyebrow' }, 'n · valor US$k') }),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 9 } },
          fn.map((f, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 14 } },
            React.createElement('span', { style: { width: 100, fontSize: 12.5, color: 'var(--text-2)', fontWeight: 600 } }, f.etapa),
            React.createElement('div', { style: { flex: 1, height: 30, borderRadius: 8, background: 'var(--surface-2)', overflow: 'hidden' } },
              React.createElement('div', { style: { width: (f.n / maxN * 100) + '%', height: '100%', background: f.color, borderRadius: 8, display: 'flex', alignItems: 'center', paddingLeft: 12 } },
                React.createElement('span', { className: 'mono', style: { color: '#fff', fontSize: 11, fontWeight: 700 } }, f.n))),
            React.createElement('span', { className: 'mono', style: { width: 56, textAlign: 'right', fontSize: 12, color: 'var(--text-3)' } }, 'US$ ' + f.valUSD + 'k')
          )))
      ),
      // kanban (drag-and-drop real → lead_change_stage)
      React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title: 'Pipeline', right: React.createElement('span', { className: 'eyebrow' }, 'arrastrá entre etapas') }),
        React.createElement('div', { className: 'kanban' },
          fn.map(col => {
            const cards = BA.leads.filter(l => l.stageKey === col.key);
            return React.createElement('div', { key: col.key, className: 'kcol',
                onDragOver: e => { e.preventDefault(); }, onDrop: e => { e.preventDefault(); onDrop(col.key); } },
              React.createElement('div', { className: 'kcol-head' },
                React.createElement('span', { className: 'nm' }, React.createElement('i', { style: { background: col.color } }), col.etapa),
                React.createElement('span', { className: 'ct' }, cards.length)),
              cards.map(l => { const s = BA.salidaById(l.salida);
                return React.createElement('div', { key: l.id, className: 'kcard', draggable: true,
                    onDragStart: () => setDrag(l.id), onDragEnd: () => setDrag(null),
                    onClick: () => openLead ? openLead(l.id) : toast('Lead · ' + l.nombre) },
                  React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', gap: 8 } },
                    React.createElement('span', { className: 'nm' }, l.nombre),
                    React.createElement(Avatar, { id: l.resp, size: 22 })),
                  React.createElement('div', { className: 'sub' }, (s ? s.region : (l.salida ? l.salida : 'Sin viaje')) + ' · ', React.createElement('span', { style: { color: l.dias > 10 ? 'var(--bad)' : 'var(--text-3)' } }, l.dias + 'd')),
                  React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 } },
                    React.createElement('span', { className: 'pot' }, 'US$ ' + l.potUSD + 'k'),
                    React.createElement('span', { className: 'tag', style: { padding: '2px 7px' } }, l.pax + ' pax')));
              }));
          }))
      )
    );
  }

  // ============ MARKETING ============
  function Marketing({ cur, toast }) {
    const [camps, setCamps] = useState(() => BA.marketing.campañas.map(c => ({ ...c })));
    const m = BA.marketing;
    const totalRev = m.atribucion.reduce((s, a) => s + a.revUSD, 0);
    const ticketOf = c => (BA.salidaById(c.salida) ? BA.salidaById(c.salida).precioUSD : 9000);
    const revOf = c => c.reservas * ticketOf(c);
    const cplOf = c => (c.leads ? Math.round(c.gastoUSD / c.leads) : 0);
    const roasOf = c => (c.gastoUSD ? revOf(c) / c.gastoUSD : 0);
    const totalGasto = camps.reduce((s, c) => s + c.gastoUSD, 0);
    const totalLeads = camps.reduce((s, c) => s + c.leads, 0);
    const totalRevCamp = camps.reduce((s, c) => s + revOf(c), 0);
    const roasAvg = totalGasto ? totalRevCamp / totalGasto : 0;
    function setGasto(i, v) { setCamps(cs => cs.map((c, j) => j === i ? { ...c, gastoUSD: Math.max(0, Math.round(+v) || 0) } : c)); }
    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' }, React.createElement('div', null,
        React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Marketing')),
        React.createElement('div', { className: 'page-greet-sub' }, 'Adquisición · ROAS por campaña · atribución por fuente'))),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
        React.createElement(StatCard, { icon: 'megaphone', iconCls: '', label: 'Gasto Meta', value: k(totalGasto / 1000, cur), sub: camps.length + ' campañas' }),
        React.createElement(StatCard, { icon: 'funnel', iconCls: 'tint', label: 'Leads generados', value: totalLeads, sub: 'desde anuncios', delta: 14 }),
        React.createElement(StatCard, { icon: 'coin', iconCls: 'tint-brass', label: 'Costo por lead', value: 'US$ ' + Math.round(totalGasto / totalLeads), sub: 'promedio' }),
        React.createElement(StatCard, { icon: 'trending', iconCls: 'tint', label: 'ROAS promedio', value: roasAvg.toFixed(1) + '×', sub: 'retorno / gasto', delta: 6 })
      ),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: '1fr', alignItems: 'start' } },
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Campañas Meta', right: React.createElement('span', { className: 'eyebrow', style: { color: 'var(--brass)' } }, 'cargá el gasto → ROAS en vivo') }),
          React.createElement('div', { style: { overflowX: 'auto' } }, React.createElement('table', { className: 'tbl' },
            React.createElement('thead', null, React.createElement('tr', null,
              ['Campaña', 'Gasto', 'Leads', 'CPL', 'Reservas', 'Revenue', 'ROAS'].map((h, i) => React.createElement('th', { key: i, style: i ? { textAlign: 'right' } : null }, h)))),
            React.createElement('tbody', null, camps.map((c, i) => React.createElement('tr', { key: i },
              React.createElement('td', null, React.createElement('span', { className: 'nm' }, c.name)),
              React.createElement('td', { style: { textAlign: 'right' } },
                React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' } },
                  React.createElement('span', { className: 'mono', style: { color: 'var(--text-faint)', fontSize: 11 } }, 'US$'),
                  React.createElement('input', { type: 'number', value: c.gastoUSD, onChange: e => setGasto(i, e.target.value),
                    style: { width: 74, textAlign: 'right', fontFamily: 'var(--ff-mono)', fontSize: 12.5, padding: '4px 8px', borderRadius: 7, border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)' } }))),
              React.createElement('td', { className: 'mono', style: { textAlign: 'right' } }, c.leads),
              React.createElement('td', { className: 'mono', style: { textAlign: 'right' } }, 'US$ ' + cplOf(c)),
              React.createElement('td', { className: 'mono', style: { textAlign: 'right' } }, c.reservas),
              React.createElement('td', { className: 'mono', style: { textAlign: 'right', color: 'var(--text-1)', fontWeight: 600 } }, k(revOf(c) / 1000, cur)),
              React.createElement('td', { style: { textAlign: 'right' } }, React.createElement('span', { className: 'badge ' + (roasOf(c) >= 4 ? 'go' : roasOf(c) >= 2 ? 'risk' : 'bad') }, roasOf(c).toFixed(1) + '×'))))))
          )
        ),
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Atribución por fuente' }),
          React.createElement('div', { className: 'donut-wrap' },
            React.createElement('div', { className: 'donut' },
              React.createElement(Donut, { segments: m.atribucion.map(a => ({ v: a.revUSD, color: a.color })), size: 120, thick: 17 }),
              React.createElement('div', { className: 'donut-center' },
                React.createElement('div', { className: 'big' }, 'US$ ' + totalRev + 'k'),
                React.createElement('div', { className: 'sm' }, 'revenue'))),
            React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 9 } },
              m.atribucion.map((a, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 } },
                React.createElement('i', { style: { width: 9, height: 9, borderRadius: 3, background: a.color } }),
                React.createElement('span', { style: { flex: 1, color: 'var(--text-2)' } }, a.fuente),
                React.createElement('span', { className: 'mono', style: { color: 'var(--text-1)', fontWeight: 600 } }, a.conv + '%'))))
          )
        )
      )
    );
  }

  // ============ CLIENTES (los que ya viajaron) ============
  const clientes = [
    { nombre: 'Familia Rudoni', viajes: 3, ltv: 142, nps: 10, ref: '—', trajo: 2 },
    { nombre: 'A. Bestani', viajes: 2, ltv: 64, nps: 9, ref: 'Rudoni', trajo: 1 },
    { nombre: 'Grupo Salvi', viajes: 2, ltv: 71, nps: 9, ref: '—', trajo: 0 },
    { nombre: 'Familia Wong', viajes: 1, ltv: 38, nps: 8, ref: 'Bestani', trajo: 1 },
  ];
  function Clientes({ cur, toast }) {
    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' }, React.createElement('div', null,
        React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Clientes')),
        React.createElement('div', { className: 'page-greet-sub' }, 'Los que ya viajaron · LTV · NPS · referidos'))),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
        React.createElement(StatCard, { icon: 'users', iconCls: '', label: 'Clientes', value: clientes.length, sub: 'histórico' }),
        React.createElement(StatCard, { icon: 'coin', iconCls: 'tint', label: 'LTV total', value: k(clientes.reduce((s, c) => s + c.ltv, 0), cur), sub: 'pagado acumulado' }),
        React.createElement(StatCard, { icon: 'star', iconCls: 'tint-brass', label: 'NPS', value: 9.0, sub: 'promedio' }),
        React.createElement(StatCard, { icon: 'spark', iconCls: 'tint', label: 'Referidos', value: clientes.reduce((s, c) => s + c.trajo, 0), sub: 'traídos por clientes' })
      ),
      React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title: 'Cartera' }),
        React.createElement('table', { className: 'tbl' },
          React.createElement('thead', null, React.createElement('tr', null,
            ['Cliente', 'Viajes', 'LTV', 'NPS', 'Referido por', 'Trajo', ''].map((h, i) => React.createElement('th', { key: i, style: i && i < 6 ? { textAlign: 'right' } : null }, h)))),
          React.createElement('tbody', null, clientes.map((c, i) => React.createElement('tr', { key: i, className: 'click', onClick: () => toast('Ficha · ' + c.nombre) },
            React.createElement('td', null, React.createElement('span', { className: 'nm' }, c.nombre)),
            React.createElement('td', { className: 'mono', style: { textAlign: 'right' } }, c.viajes),
            React.createElement('td', { className: 'mono', style: { textAlign: 'right', color: 'var(--text-1)', fontWeight: 600 } }, k(c.ltv, cur)),
            React.createElement('td', { style: { textAlign: 'right' } }, React.createElement('span', { className: 'badge go' }, c.nps)),
            React.createElement('td', { style: { textAlign: 'right' } }, c.ref),
            React.createElement('td', { className: 'mono', style: { textAlign: 'right' } }, c.trajo),
            React.createElement('td', { style: { textAlign: 'right' } }, React.createElement('button', { className: 'btn sm', onClick: e => { e.stopPropagation(); toast('Invitación a próxima salida'); } }, 'Invitar')))))
        )
      )
    );
  }

  // ============ BIBLIOTECA (proveedores + accesos) ============
  const ETAPA = { identificado: { c: 'ghost', t: 'Identificado' }, contactado: { c: 'curso', t: 'Contactado' }, negociando: { c: 'risk', t: 'Negociando' }, confirmado: { c: 'go', t: 'Confirmado' } };
  function Biblioteca({ toast }) {
    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' }, React.createElement('div', null,
        React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Biblioteca')),
        React.createElement('div', { className: 'page-greet-sub' }, 'Activos reutilizables · acá viven los ', React.createElement('b', null, 'Accesos')))),
      React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title: 'Accesos', count: BA.accesos.length, right: React.createElement('span', { className: 'eyebrow', style: { color: 'var(--brass)' } }, 'pilar · Acceso') }),
        React.createElement('table', { className: 'tbl' },
          React.createElement('thead', null, React.createElement('tr', null,
            ['Encuentro', 'Figura', 'Salida', 'Responsable', 'Estado', 'Deadline'].map((h, i) => React.createElement('th', { key: i }, h)))),
          React.createElement('tbody', null, BA.accesos.map((a, i) => { const s = BA.salidaById(a.salida); const e = ETAPA[a.etapa];
            return React.createElement('tr', { key: i, className: 'click', onClick: () => toast('Acceso · ' + a.nombre) },
              React.createElement('td', null, React.createElement('span', { className: 'nm' }, a.nombre)),
              React.createElement('td', null, a.figura),
              React.createElement('td', null, s ? s.region : a.salida),
              React.createElement('td', null, React.createElement(Avatar, { id: a.resp, size: 24 })),
              React.createElement('td', null, React.createElement('span', { className: 'badge ' + e.c }, e.t)),
              React.createElement('td', { className: 'mono', style: { color: a.deadline.includes('hoy') ? 'var(--bad)' : 'var(--text-3)' } }, a.deadline));
          }))
        )
      )
    );
  }

  window.Ventas = Ventas;
  window.Marketing = Marketing;
  window.Clientes = Clientes;
  window.Biblioteca = Biblioteca;
  window.Configuracion = () => stub('Configuración', 'Operadores · cuentas de correo · Meta/WhatsApp · política de pagos · marca', 'settings');
})();
