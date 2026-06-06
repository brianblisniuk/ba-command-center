/* B&A · Plano Viaje V2: Cupos · Pulso · To-Do con drawer → window (override Tareas) */
(function () {
  const { Icon, StatCard, Avatar, Badge, OccBar, CardHead } = window;
  const { useState } = React;
  const BA = window.BA;

  // ============ CUPOS ============
  function Cupos({ s, cur, toast, openLead }) {
    const { confirmados, pipeline } = BA.tripData(s.id).reservas;
    const reservadoPax = confirmados.reduce((a, c) => a + c.pax, 0);
    const potencialesPax = pipeline.filter(l => (l.stageKey || '') !== 'booked').reduce((a, l) => a + (Number(l.pax) || 1), 0);
    const cap = Math.max(s.min + 2, s.conf + s.opcion + s.libres);
    const libres = Math.max(0, cap - s.conf - s.opcion);
    const beReached = s.conf >= s.breakeven;
    const seg = [
      { k: 'Reservado', n: s.conf, c: 'var(--accent)' },
      { k: 'En opción', n: s.opcion, c: 'var(--brass)' },
      { k: 'Libres', n: libres, c: 'var(--surface-sunk)' },
    ];
    return React.createElement('div', null,
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
        React.createElement(StatCard, { icon: 'users', iconCls: '', label: 'Reservados', value: s.conf, unit: 'pax', sub: reservadoPax + ' personas' }),
        React.createElement(StatCard, { icon: 'funnel', iconCls: 'tint-brass', label: 'En opción', value: s.opcion, sub: 'sin seña' }),
        React.createElement(StatCard, { icon: 'target', iconCls: beReached ? 'tint' : 'tint-bad', label: 'Break-even', value: s.conf + ' / ' + s.breakeven, sub: beReached ? 'alcanzado' : 'faltan ' + (s.breakeven - s.conf) }),
        React.createElement(StatCard, { icon: 'compass', iconCls: 'tint', label: 'Libres', value: libres, sub: 'de ' + cap + ' lugares' })
      ),
      React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
        React.createElement(CardHead, { title: 'Ocupación', right: React.createElement('span', { className: 'eyebrow' }, 'mínimo ' + s.min + ' · break-even ' + s.breakeven) }),
        React.createElement('div', { style: { marginTop: 4 } }, React.createElement(OccBar, { s })),
        React.createElement('div', { className: 'chart-legend', style: { marginTop: 16 } },
          seg.map((g, i) => React.createElement('span', { key: i, className: 'lg' }, React.createElement('i', { style: { background: g.c, borderRadius: 3 } }), g.k + ' · ' + g.n)))
      ),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', alignItems: 'start' } },
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Reservados', count: confirmados.length }),
          confirmados.length === 0
            ? React.createElement('div', { style: { fontSize: 13, color: 'var(--text-3)', padding: '6px 0' } }, 'Todavía sin reservas confirmadas.')
            : confirmados.map((c, i) => React.createElement('div', { key: i, className: 'row click', style: { cursor: openLead ? 'pointer' : 'default' }, onClick: () => openLead && c.leadId && openLead(c.leadId) },
                React.createElement('span', { className: 'av', style: { background: 'var(--laurel)' } }, c.nombre[0]),
                React.createElement('div', { style: { flex: 1 } }, React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-1)' } }, c.nombre),
                  React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)' } }, c.pax + ' pax · ' + c.cuota)),
                c.pagado == null
                  ? React.createElement('span', { className: 'badge ghost', style: { padding: '2px 7px' } }, 'sin plan')
                  : React.createElement('span', { className: 'badge ' + (c.pagado === 100 ? 'go' : 'risk'), style: { padding: '2px 7px' } }, c.pagado + '%')))
        ),
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'En pipeline', count: pipeline.length, right: potencialesPax > 0 ? React.createElement('span', { className: 'eyebrow' }, potencialesPax + ' pax en gestión') : null }),
          pipeline.length === 0
            ? React.createElement('div', { style: { fontSize: 13, color: 'var(--text-3)', padding: '6px 0' } }, 'Sin leads para esta salida.')
            : pipeline.map((l, i) => React.createElement('div', { key: i, className: 'row click', style: { cursor: openLead ? 'pointer' : 'default' }, onClick: () => openLead && openLead(l.id) },
                React.createElement(Avatar, { id: l.resp, size: 28 }),
                React.createElement('div', { style: { flex: 1 } }, React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-1)' } }, l.nombre),
                  React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)' } }, l.etapa)),
                React.createElement('span', { className: 'mono', style: { fontSize: 12, color: 'var(--accent)', fontWeight: 600 } }, 'US$ ' + l.potUSD + 'k')))
        )
      )
    );
  }

  // ============ PULSO (del viaje) ============
  function Pulso({ s, cur, toast, openLead }) {
    const leads = BA.leads.filter(l => l.salida === s.id);
    const activos = leads.length;
    const potencial = leads.reduce((a, l) => a + l.potUSD, 0);
    const cierra = leads.filter(l => l.etapa === 'Negociación');
    const enfria = leads.filter(l => l.dias > 10);
    const reservadosMes = leads.filter(l => l.etapa === 'Reservado').length;
    function Col({ title, icon, cls, list, empty }) {
      return React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title, count: list.length }),
        list.length === 0
          ? React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-3)', padding: '6px 0' } }, empty)
          : React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 0 } },
              list.map((l, i) => React.createElement('div', { key: i, className: 'row click', style: { cursor: 'pointer' }, onClick: () => openLead && openLead(l.id) },
                React.createElement('span', { className: 'q-ic ' + cls, style: { width: 32, height: 32, borderRadius: 9 } }, React.createElement(Icon, { name: icon })),
                React.createElement('div', { style: { flex: 1, minWidth: 0 } }, React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-1)' } }, l.nombre),
                  React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)' } }, l.next + ' · ' + l.dias + 'd')),
                React.createElement('span', { className: 'mono', style: { fontSize: 12, color: 'var(--accent)', fontWeight: 600 } }, 'US$ ' + l.potUSD + 'k'))))
      );
    }
    return React.createElement('div', null,
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
        React.createElement(StatCard, { icon: 'funnel', iconCls: '', label: 'Leads activos', value: activos, sub: 'para esta salida' }),
        React.createElement(StatCard, { icon: 'coin', iconCls: 'tint', label: 'Potencial', value: 'US$ ' + potencial + 'k', sub: 'pipeline del viaje' }),
        React.createElement(StatCard, { icon: 'spark', iconCls: 'tint-brass', label: 'Por cerrar', value: cierra.length, sub: 'en negociación' }),
        React.createElement(StatCard, { icon: 'snow', iconCls: 'tint-bad', label: 'Enfriándose', value: enfria.length, sub: '+10 días sin tocar' })
      ),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' } },
        React.createElement(Col, { title: 'Por cerrar', icon: 'spark', cls: 'go', list: cierra, empty: 'Nada en negociación ahora.' }),
        React.createElement(Col, { title: 'Se enfrían', icon: 'snow', cls: 'info', list: enfria, empty: 'Ningún lead frío. 👌' }),
        React.createElement(Col, { title: 'Reservados del mes', icon: 'check', cls: 'go', list: leads.filter(l => l.etapa === 'Reservado'), empty: 'Sin reservas este mes.' })
      )
    );
  }

  // ============ TO-DO con drawer ============
  const TT = { reserva: 'Reserva', compra: 'Compra', contacto: 'Contacto', research: 'Research', logística: 'Logística', otro: 'Otro' };
  const TICON = { reserva: 'funnel', compra: 'coin', contacto: 'phone', research: 'eye', logística: 'route', otro: 'list' };
  const PCOL = { P1: 'bad', P2: 'risk', P3: 'ghost' };
  function Tareas({ s, toast, openProvider, op }) {
    const TT2R = { reserva: 'reservation', contacto: 'contact', research: 'research', compra: 'purchase', 'logística': 'logistics', otro: 'other' };
    const mount = () => BA.tripData(s.id).tareas.map((t, i) => ({ ...t, id: t.id || ('tmp' + i + '_' + Math.random().toString(36).slice(2, 5)), vinculo: '—' }));
    const [items, setItems] = useState(mount);
    const [filtro, setFiltro] = useState('all');
    const [sel, setSel] = useState(null);
    const [adding, setAdding] = useState(false);
    const [newT, setNewT] = useState('');
    const toStore = (arr) => arr.map(t => { const o = { priority: t.p || 'P3', type: TT2R[t.tipo] || 'other', task: t.t || '', done: !!t.done, dueDate: t.due || '', note: t.note || '' }; if (t.id && !String(t.id).startsWith('tmp')) o.id = t.id; return o; });
    async function persist(next) { setItems(next); const r = await BA.source.tripDataApply(s.id, 'actions', 'set', { items: toStore(next) }); if (r && r.ok) setItems(mount()); else toast((r && r.error) || 'No se pudo guardar'); }
    function toggle(id) { persist(items.map(t => t.id === id ? { ...t, done: !t.done } : t)); }
    function removeTask(id) { setSel(null); persist(items.filter(t => t.id !== id)); }
    function addTask() { const v = newT.trim(); if (!v) { setAdding(false); return; } setAdding(false); setNewT(''); persist([...items, { id: 'tmp_new_' + Date.now(), p: 'P3', tipo: 'otro', t: v, done: false, due: '', vinculo: '—' }]); }
    const list = items.filter(t => filtro === 'all' ? true : filtro === 'pend' ? !t.done : t.p === filtro);
    const cur = items.find(t => t.id === sel);
    const counts = { P1: items.filter(t => t.p === 'P1' && !t.done).length, P2: items.filter(t => t.p === 'P2' && !t.done).length, P3: items.filter(t => t.p === 'P3' && !t.done).length };

    return React.createElement('div', null,
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 'var(--gap)' } },
        React.createElement(StatCard, { icon: 'alert', iconCls: 'tint-bad', label: 'P1 pendientes', value: counts.P1, sub: 'crítico' }),
        React.createElement(StatCard, { icon: 'clock', iconCls: 'tint-brass', label: 'P2 pendientes', value: counts.P2, sub: 'importante' }),
        React.createElement(StatCard, { icon: 'list', iconCls: 'tint', label: 'P3 pendientes', value: counts.P3, sub: 'cuando se pueda' })
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14, flexWrap: 'wrap' } },
        React.createElement('div', { style: { display: 'flex', gap: 7, flexWrap: 'wrap' } },
          [['all', 'Todas'], ['pend', 'Pendientes'], ['P1', 'P1'], ['P2', 'P2'], ['P3', 'P3']].map(([k, t]) =>
            React.createElement('button', { key: k, className: 'badge ' + (filtro === k ? 'go' : 'ghost'), style: { cursor: 'pointer', padding: '6px 11px' }, onClick: () => setFiltro(k) }, t))),
        React.createElement('button', { className: 'btn sm primary', onClick: () => setAdding(a => !a) }, React.createElement(Icon, { name: 'plus' }), 'Agregar tarea')),
      adding && React.createElement('div', { className: 'card pad', style: { marginBottom: 12, display: 'flex', gap: 8 } },
        React.createElement('input', { autoFocus: true, value: newT, placeholder: 'Nueva tarea (P3 por defecto)…', onChange: e => setNewT(e.target.value), onKeyDown: e => { if (e.key === 'Enter') addTask(); if (e.key === 'Escape') { setAdding(false); setNewT(''); } }, style: { flex: 1, padding: '9px 11px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13 } }),
        React.createElement('button', { className: 'btn sm primary', onClick: addTask }, 'Guardar')),
      React.createElement('div', { className: 'card pad' },
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 0 } },
          list.map(t => React.createElement('div', { key: t.id, className: 'row', style: { gap: 13, cursor: 'pointer' }, onClick: () => setSel(t.id) },
            React.createElement('button', { onClick: e => { e.stopPropagation(); toggle(t.id); }, style: { width: 22, height: 22, borderRadius: 7, flexShrink: 0, border: '1.6px solid ' + (t.done ? 'var(--go)' : 'var(--rule-strong)'), background: t.done ? 'var(--go)' : 'transparent', display: 'grid', placeItems: 'center', color: '#fff' } },
              t.done && React.createElement(Icon, { name: 'check', style: { width: 13, height: 13, strokeWidth: 3 } })),
            React.createElement('div', { style: { flex: 1, minWidth: 0 } },
              React.createElement('div', { style: { fontSize: 13.5, color: t.done ? 'var(--text-faint)' : 'var(--text-1)', textDecoration: t.done ? 'line-through' : 'none' } }, t.t),
              t.vinculo !== '—' && React.createElement('div', { style: { fontSize: 11, color: 'var(--text-3)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 } }, React.createElement(Icon, { name: 'route', style: { width: 11, height: 11 } }), t.vinculo)),
            React.createElement('span', { className: 'tag', style: { padding: '2px 8px' } }, TT[t.tipo]),
            React.createElement('span', { className: 'badge ' + PCOL[t.p], style: { padding: '2px 7px' } }, t.p)))
        )
      ),
      // drawer
      cur && React.createElement('div', null,
        React.createElement('div', { className: 'drawer-overlay', onClick: () => setSel(null) }),
        React.createElement('div', { className: 'drawer' },
          React.createElement('div', { className: 'drawer-head' },
            React.createElement('span', { className: 'q-ic ' + (cur.done ? 'go' : PCOL[cur.p] === 'bad' ? 'bad' : 'risk'), style: { borderRadius: 11 } }, React.createElement(Icon, { name: TICON[cur.tipo] })),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('h3', null, cur.t),
              React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-3)', marginTop: 3 } }, TT[cur.tipo] + ' · ' + cur.p)),
            React.createElement('button', { className: 'drawer-close', onClick: () => setSel(null) }, React.createElement(Icon, { name: 'x' }))),
          React.createElement('div', { className: 'drawer-body' },
            React.createElement('div', { style: { display: 'flex', gap: 9, marginBottom: 18 } },
              React.createElement('button', { className: 'btn ' + (cur.done ? '' : 'primary'), style: { flex: 1 }, onClick: () => { if (!cur.done) { window.confetti && window.confetti(); toast('¡Tarea hecha! 🎉'); } else toast('Reabierta'); toggle(cur.id); } },
                React.createElement(Icon, { name: 'check' }), cur.done ? 'Reabrir' : 'Marcar hecha'),
              React.createElement('button', { className: 'btn', onClick: () => removeTask(cur.id) }, 'Eliminar')),
            React.createElement('div', { className: 'card pad', style: { boxShadow: 'none' } },
              React.createElement('div', { className: 'kv' }, React.createElement('span', { className: 'k' }, 'Estado'), React.createElement('span', { className: 'v' }, cur.done ? 'Hecha' : 'Pendiente')),
              React.createElement('div', { className: 'kv' }, React.createElement('span', { className: 'k' }, 'Prioridad'), React.createElement('span', { className: 'v' }, React.createElement('span', { className: 'badge ' + PCOL[cur.p], style: { padding: '2px 7px' } }, cur.p))),
              React.createElement('div', { className: 'kv' }, React.createElement('span', { className: 'k' }, 'Tipo'), React.createElement('span', { className: 'v' }, TT[cur.tipo])),
              React.createElement('div', { className: 'kv' }, React.createElement('span', { className: 'k' }, 'Deadline'), React.createElement('span', { className: 'v' }, cur.due || '—')),
              React.createElement('div', { className: 'kv' }, React.createElement('span', { className: 'k' }, 'Responsable'), React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 7 } }, React.createElement(Avatar, { id: s.resp, size: 22 }), React.createElement('span', { style: { fontSize: 12.5, color: 'var(--text-1)' } }, BA.operadores.find(o => o.id === s.resp).short)))),
            React.createElement('div', { style: { marginTop: 16 } },
              React.createElement('div', { className: 'eyebrow', style: { marginBottom: 8 } }, 'Notas'),
              React.createElement('textarea', { key: 'note_' + cur.id, defaultValue: cur.note || '', placeholder: 'Agregar una nota…', onBlur: e => { const v = e.target.value; if (v !== (cur.note || '')) persist(items.map(x => x.id === cur.id ? { ...x, note: v } : x)); }, style: { width: '100%', minHeight: 70, padding: 11, borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13, resize: 'vertical' } })),
            op && window.CommentsSection && React.createElement(window.CommentsSection, { ckey: 'task:' + cur.id, op, toast })
          )
        )
      )
    );
  }

  Object.assign(window, { Cupos, Pulso, Tareas });
})();
