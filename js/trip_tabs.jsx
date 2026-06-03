/* B&A · pestañas del Plano Viaje → window (Itinerario, Ruta, Proveedores, Presupuesto, Reservas, Tareas, AppCliente) */
(function () {
  const { Icon, Donut, Badge, Avatar, CardHead } = window;
  const { useState } = React;
  const BA = window.BA;
  const M = (usd, cur) => BA.money(usd, cur);

  // ============ ITINERARIO ============
  function Itinerario({ s, cur, toast, openProvider, op }) {
    const data = BA.tripData(s.id).itinerario;
    const [capa, setCapa] = useState('op'); // op | cliente
    const [open, setOpen] = useState(() => new Set(data.map(d => d.n)));
    const [expanded, setExpanded] = useState(null); // slot id
    const [verdicts, setVerdicts] = useState({}); // id -> verdict override
    const [vis, setVis] = useState({}); // id -> bool override
    function toggle(n) { setOpen(o => { const x = new Set(o); x.has(n) ? x.delete(n) : x.add(n); return x; }); }
    const allOpen = open.size === data.length;
    const VERDICTS = ['Confirmado', 'Por confirmar', 'En gestión'];
    const vClass = v => v === 'Confirmado' ? 'go' : v === 'Por confirmar' ? 'risk' : 'bad';
    function cycleVerdict(id, cur) { const next = VERDICTS[(VERDICTS.indexOf(cur) + 1) % 3]; setVerdicts(s => ({ ...s, [id]: next })); toast('Veredicto → ' + next); }
    function vOf(sl) { return verdicts[sl.id] || sl.verdict; }
    function visOf(sl) { return vis[sl.id] != null ? vis[sl.id] : sl.clientVisible; }
    function toggleVis(id, cur) { setVis(s => ({ ...s, [id]: !cur })); toast(!cur ? 'Visible al cliente' : 'Oculto al cliente'); }

    return React.createElement('div', null,
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' } },
        React.createElement('div', { className: 'tb-seg' },
          [['op', 'Operativo'], ['cliente', 'Cliente']].map(([k, t]) => React.createElement('button', { key: k, className: capa === k ? 'on' : '', onClick: () => setCapa(k) }, t))),
        React.createElement('div', { style: { display: 'flex', gap: 8 } },
          React.createElement('button', { className: 'btn sm', onClick: () => setOpen(allOpen ? new Set() : new Set(data.map(d => d.n))) }, React.createElement(Icon, { name: 'layers' }), allOpen ? 'Colapsar' : 'Expandir'),
          React.createElement('button', { className: 'btn sm primary', onClick: () => toast('Día agregado al final') }, React.createElement(Icon, { name: 'plus' }), 'Agregar día'))
      ),
      // leyenda de tipos de slot
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16, padding: '11px 15px', background: capa === 'cliente' ? 'var(--curso-bg)' : 'var(--surface-2)', borderRadius: 'var(--radius-sm)' } },
        capa === 'cliente'
          ? React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5, color: 'var(--text-2)' } }, React.createElement(Icon, { name: 'eye', style: { width: 16, height: 16, color: 'var(--curso)' } }), 'Capa narrativa — así lo ve el huésped: sin precios, sin notas internas, sin accesos en gestión.')
          : ['meal', 'wine', 'access', 'culture', 'activity', 'transfer', 'lodging'].map(tp => { const st = BA.STYPE[tp];
              return React.createElement('span', { key: tp, style: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-3)' } },
                React.createElement('span', { className: 'slot-glyph', style: { width: 18, height: 18, fontSize: 10, background: st.c } }, st.g), st.t); })
      ),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 14 } },
        data.map(day => {
          const isOpen = open.has(day.n);
          const slots = capa === 'cliente' ? day.slots.filter(sl => visOf(sl) && vOf(sl) !== 'En gestión') : day.slots;
          return React.createElement('div', { key: day.n, className: 'card', style: { overflow: 'hidden' } },
            React.createElement('div', { onClick: () => toggle(day.n), style: { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', cursor: 'pointer' } },
              React.createElement('div', { className: 'day-cover', style: { background: 'linear-gradient(150deg, var(--laurel-soft), ' + day.cover + ')' } },
                React.createElement('div', { style: { textAlign: 'center', lineHeight: 1 } },
                  React.createElement('div', { style: { fontSize: 22 } }, day.n),
                  React.createElement('div', { style: { fontFamily: 'var(--ff-mono)', fontSize: 8, letterSpacing: '.1em', opacity: .85, marginTop: 2 } }, day.dow))),
              React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                React.createElement('div', { style: { fontSize: 16, fontWeight: 650, color: 'var(--text-1)', fontFamily: 'var(--ff-display)' } }, day.title),
                React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)', marginTop: 3, fontFamily: 'var(--ff-mono)' } },
                  slots.length + ' slots · ' + day.free + ' h libres' + (capa === 'op' ? ' · est. ' + M(day.estUSD, cur) : ''))),
              capa === 'op' && React.createElement('button', { className: 'tag', title: 'Templates de día', style: { padding: '5px 9px' }, onClick: e => { e.stopPropagation(); toast('Guardar día como template'); } }, React.createElement(Icon, { name: 'copy' }), 'Template'),
              React.createElement(Icon, { name: isOpen ? 'cd' : 'cr', style: { color: 'var(--text-3)' } })),
            isOpen && React.createElement('div', { style: { padding: '0 18px 18px' } },
              slots.map((sl, i) => {
                const st = BA.STYPE[sl.type]; const v = vOf(sl); const isExp = expanded === sl.id; const showV = visOf(sl);
                return React.createElement('div', { key: sl.id },
                  i > 0 && capa === 'op' && React.createElement('div', { className: 'travel-chip' }, React.createElement(Icon, { name: i % 2 ? 'route' : 'pin' }), i % 2 ? 'auto · ' + (8 + i * 2) + ' min' : 'a pie · ' + (4 + i) + ' min'),
                  React.createElement('div', { className: 'slot' + (sl.conflict && capa === 'op' ? ' conflict' : ''), style: { marginTop: i === 0 ? 6 : 4 } },
                    React.createElement('div', { style: { width: 5, flexShrink: 0, background: st.c } }),
                    React.createElement('div', { className: 'slot-time' },
                      React.createElement('div', { className: 'a' }, sl.time),
                      React.createElement('div', { className: 'b' }, sl.end)),
                    React.createElement('div', { className: 'slot-main', onClick: () => capa === 'op' && setExpanded(isExp ? null : sl.id) },
                      React.createElement('div', { className: 'slot-head' },
                        React.createElement('span', { className: 'slot-glyph', style: { background: st.c } }, st.g),
                        React.createElement('span', { className: 'slot-title' }, capa === 'cliente' ? sl.client.title : sl.title),
                        capa === 'op' && sl.access && React.createElement('span', { className: 'badge brass', style: { padding: '2px 7px' } }, React.createElement(Icon, { name: 'key', style: { width: 10, height: 10 } }), 'Acceso'),
                        capa === 'op' && React.createElement('span', { className: 'badge ' + vClass(v), style: { padding: '2px 7px', cursor: 'pointer' }, onClick: e => { e.stopPropagation(); cycleVerdict(sl.id, v); } }, v),
                        capa === 'op' && React.createElement(Icon, { name: isExp ? 'cd' : 'cr', style: { color: 'var(--text-faint)', width: 16, height: 16 } })),
                      React.createElement('div', { className: 'slot-desc' }, capa === 'cliente' ? sl.client.desc : sl.desc),
                      capa === 'op' && React.createElement('div', { className: 'slot-meta' },
                        React.createElement('span', { className: 'tag', style: { padding: '2px 8px' } }, st.t),
                        sl.provider !== '—' && React.createElement('span', { className: 'tag', style: { padding: '2px 8px', cursor: 'pointer' }, onClick: e => { e.stopPropagation(); openProvider ? openProvider('p1') : toast(sl.provider); } }, React.createElement(Icon, { name: 'users' }), sl.provider),
                        sl.attachments > 0 && React.createElement('span', { className: 'tag', style: { padding: '2px 8px' } }, React.createElement(Icon, { name: 'book' }), sl.attachments),
                        sl.comments > 0 && React.createElement('span', { className: 'tag', style: { padding: '2px 8px' } }, React.createElement(Icon, { name: 'chat' }), sl.comments),
                        sl.conflict && React.createElement('span', { className: 'badge bad', style: { padding: '2px 7px' } }, React.createElement(Icon, { name: 'alert', style: { width: 10, height: 10 } }), 'Conflicto horario'),
                        React.createElement('span', { className: 'vis-toggle' + (showV ? ' on' : ''), onClick: e => { e.stopPropagation(); toggleVis(sl.id, showV); } }, React.createElement(Icon, { name: 'eye' }), showV ? 'Visible' : 'Oculto')),
                      // expanded: dos capas
                      isExp && capa === 'op' && React.createElement('div', { className: 'slot-expand' },
                        React.createElement('div', { className: 'layer' },
                          React.createElement('div', { className: 'layer-h' }, React.createElement(Icon, { name: 'settings', style: { width: 12, height: 12 } }), 'Operativo (interno)'),
                          React.createElement('div', { className: 'layer-t' }, sl.internal.title),
                          React.createElement('div', { className: 'layer-d' }, sl.internal.desc)),
                        React.createElement('div', { className: 'layer cli' },
                          React.createElement('div', { className: 'layer-h' }, React.createElement(Icon, { name: 'eye', style: { width: 12, height: 12 } }), 'Cliente (narrativa)'),
                          React.createElement('div', { className: 'layer-t' }, sl.client.title),
                          React.createElement('div', { className: 'layer-d' }, sl.client.desc))),
                      isExp && capa === 'op' && React.createElement('div', { className: 'slot-actions' },
                        React.createElement('button', { className: 'btn sm', onClick: e => { e.stopPropagation(); toast('Editar slot'); } }, React.createElement(Icon, { name: 'list' }), 'Editar'),
                        React.createElement('button', { className: 'btn sm', onClick: e => { e.stopPropagation(); openProvider ? openProvider('p1') : toast('Asignar proveedor'); } }, React.createElement(Icon, { name: 'users' }), 'Proveedor'),
                        React.createElement('button', { className: 'btn sm', onClick: e => { e.stopPropagation(); toast('Adjuntar archivo'); } }, React.createElement(Icon, { name: 'plus' }), 'Adjunto'),
                        sl.access && React.createElement('button', { className: 'btn sm', onClick: e => { e.stopPropagation(); toast('Marcar acceso confirmado'); } }, React.createElement(Icon, { name: 'key' }), 'Acceso')),
                      isExp && capa === 'op' && op && window.CommentsSection && React.createElement('div', { onClick: e => e.stopPropagation(), style: { paddingLeft: 35 } },
                        React.createElement(window.CommentsSection, { ckey: 'slot:' + sl.id, op, toast }))
                    )
                  )
                );
              }),
              capa === 'op' && React.createElement('button', { className: 'btn sm', style: { marginTop: 12, marginLeft: 0 }, onClick: () => toast('Agregar slot al día ' + day.n) }, React.createElement(Icon, { name: 'plus' }), 'Agregar slot')
            )
          );
        })
      )
    );
  }

  // ============ RUTA ============
  function Ruta({ s, cur, toast }) {
    const data = BA.tripData(s.id).itinerario;
    const [dia, setDia] = useState(data[1] ? 2 : 1);
    const [modo, setModo] = useState('dia'); // dia | p2p
    const [sheet, setSheet] = useState(null); // stop seleccionado
    const day = data.find(d => d.n === dia) || data[0];
    const stops = day.slots.filter(sl => sl.type !== 'lodging');
    const legs = stops.slice(1).map((sl, i) => ({ from: stops[i].title, to: sl.title, mode: i % 2 ? 'auto' : 'a pie', mins: i % 2 ? 12 + i * 3 : 6 + i * 2 }));
    const totalDrive = legs.filter(l => l.mode === 'auto').reduce((a, l) => a + l.mins, 0);
    // punto a punto
    const puntos = ['Basecamp · ' + s.region, ...stops.map(st => st.title)];
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(1);
    const p2pMins = 8 + Math.abs(to - from) * 6;
    const xy = (i, n) => ({ x: 14 + (i * 72) / Math.max(1, n - 1), y: 22 + (i % 2 ? 26 : -4) + 18 });

    return React.createElement('div', null,
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' } },
        React.createElement('div', { className: 'seg-tabs', style: { maxWidth: 240 } },
          [['dia', 'Modo día'], ['p2p', 'Punto a punto']].map(([k, t]) => React.createElement('button', { key: k, className: modo === k ? 'on' : '', onClick: () => { setModo(k); setSheet(null); } }, t))),
        modo === 'dia'
          ? React.createElement('span', { className: 'tag' }, React.createElement(Icon, { name: 'route', style: { width: 13, height: 13 } }), 'Total en auto · ' + totalDrive + ' min')
          : React.createElement('span', { className: 'tag' }, React.createElement(Icon, { name: 'route', style: { width: 13, height: 13 } }), 'Ruta frecuente · auto')
      ),
      modo === 'dia' && React.createElement('div', { className: 'tb-seg', style: { marginBottom: 14, display: 'inline-flex' } },
        data.map(d => React.createElement('button', { key: d.n, className: dia === d.n ? 'on' : '', onClick: () => { setDia(d.n); setSheet(null); } }, 'Día ' + d.n))),
      modo === 'p2p' && React.createElement('div', { className: 'card pad', style: { marginBottom: 14 } },
        React.createElement('div', { style: { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' } },
          React.createElement('div', { style: { flex: 1, minWidth: 160 } }, React.createElement('div', { className: 'eyebrow', style: { marginBottom: 6 } }, 'Desde'),
            React.createElement('select', { value: from, onChange: e => setFrom(+e.target.value), style: { width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13 } }, puntos.map((p, i) => React.createElement('option', { key: i, value: i }, p)))),
          React.createElement(Icon, { name: 'arrowright', style: { width: 18, height: 18, color: 'var(--text-3)', marginBottom: 10 } }),
          React.createElement('div', { style: { flex: 1, minWidth: 160 } }, React.createElement('div', { className: 'eyebrow', style: { marginBottom: 6 } }, 'Hasta'),
            React.createElement('select', { value: to, onChange: e => setTo(+e.target.value), style: { width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13 } }, puntos.map((p, i) => React.createElement('option', { key: i, value: i }, p)))),
          React.createElement('div', { style: { textAlign: 'right' } }, React.createElement('div', { className: 'figure', style: { fontSize: 22, color: 'var(--text-1)' } }, p2pMins, React.createElement('span', { style: { fontSize: 12, color: 'var(--text-3)', marginLeft: 3 } }, 'min')), React.createElement('div', { className: 'eyebrow' }, 'en auto')))),
      React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title: modo === 'dia' ? day.title : 'Ruta directa', right: React.createElement('button', { className: 'card-link', onClick: () => toast('Abrir en Google Maps') }, 'Google Maps', React.createElement(Icon, { name: 'cr' })) }),
        React.createElement('div', { style: { position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--surface-2)', aspectRatio: '16/10' } },
          React.createElement('svg', { viewBox: '0 0 100 75', preserveAspectRatio: 'none', style: { position: 'absolute', inset: 0, width: '100%', height: '100%' } },
            [15, 30, 45, 60].map(y => React.createElement('line', { key: 'h' + y, x1: 0, x2: 100, y1: y, y2: y, stroke: 'var(--rule-soft)', strokeWidth: 0.3 })),
            [20, 40, 60, 80].map(x => React.createElement('line', { key: 'v' + x, x1: x, x2: x, y1: 0, y2: 75, stroke: 'var(--rule-soft)', strokeWidth: 0.3 })),
            modo === 'dia'
              ? React.createElement('path', { d: stops.map((sl, i) => { const p = xy(i, stops.length); return (i ? 'L' : 'M') + p.x + ' ' + p.y; }).join(' '), fill: 'none', stroke: 'var(--brass)', strokeWidth: 0.7, strokeDasharray: '1.5 1.5' })
              : React.createElement('path', { d: 'M 18 30 Q 50 20 82 50', fill: 'none', stroke: 'var(--brass)', strokeWidth: 0.8, strokeDasharray: '1.5 1.5' })),
          modo === 'dia'
            ? stops.map((sl, i) => { const p = xy(i, stops.length);
                return React.createElement('div', { key: i, style: { position: 'absolute', left: p.x + '%', top: p.y + '%', transform: 'translate(-50%,-50%)', width: 26, height: 26, borderRadius: 9, background: sl.access ? 'var(--brass)' : 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--ff-mono)', fontSize: 12, fontWeight: 700, boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }, title: sl.title, onClick: () => setSheet(sl) }, i + 1); })
            : [['18%', '30%', 'A'], ['82%', '50%', 'B']].map((p, i) => React.createElement('div', { key: i, style: { position: 'absolute', left: p[0], top: p[1], transform: 'translate(-50%,-50%)', width: 28, height: 28, borderRadius: 9, background: i ? 'var(--brass)' : 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--ff-mono)', fontSize: 12, fontWeight: 700, boxShadow: 'var(--shadow-sm)' } }, p[2])),
          // bottom sheet
          sheet && React.createElement('div', { className: 'sheet' },
            React.createElement('span', { className: 'sheet-grab' }),
            React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 4 } },
              React.createElement('span', { className: 'slot-glyph', style: { background: (BA.STYPE[sheet.type] || {}).c || 'var(--accent)' } }, (BA.STYPE[sheet.type] || {}).g || '●'),
              React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                React.createElement('div', { style: { fontSize: 14, fontWeight: 650, color: 'var(--text-1)' } }, sheet.title),
                React.createElement('div', { style: { fontSize: 12, color: 'var(--text-3)', marginTop: 2 } }, sheet.time + '–' + sheet.end + ' · ' + (sheet.provider || '—'))),
              React.createElement('button', { className: 'drawer-close', style: { width: 28, height: 28 }, onClick: () => setSheet(null) }, React.createElement(Icon, { name: 'x' }))),
            React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 12 } },
              React.createElement('button', { className: 'btn sm primary', style: { flex: 1 }, onClick: () => toast('Abrir slot') }, React.createElement(Icon, { name: 'list' }), 'Abrir slot'),
              React.createElement('button', { className: 'btn sm', style: { flex: 1 }, onClick: () => toast('Abrir en Google Maps') }, React.createElement(Icon, { name: 'pin' }), 'Ver en mapa')))
        ),
        modo === 'dia' && React.createElement('div', { style: { marginTop: 16 } },
          stops.map((sl, i) => React.createElement('div', { key: i },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 11, padding: '8px 0', cursor: 'pointer' }, onClick: () => setSheet(sl) },
              React.createElement('span', { style: { width: 24, height: 24, borderRadius: 8, flexShrink: 0, background: sl.access ? 'var(--brass)' : 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--ff-mono)', fontSize: 11, fontWeight: 700 } }, i + 1),
              React.createElement('span', { style: { flex: 1, fontSize: 13, color: 'var(--text-1)', fontWeight: 600 } }, sl.title)),
            legs[i] && React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0 2px 35px', fontSize: 11.5, color: 'var(--text-3)' } },
              React.createElement(Icon, { name: legs[i].mode === 'auto' ? 'route' : 'pin', style: { width: 13, height: 13 } }), legs[i].mode + ' · ' + legs[i].mins + ' min'))))
      )
    );
  }

  // ============ PROVEEDORES ============
  const PT = { restaurant: 'Restaurante', winery: 'Bodega', wine: 'Bodega', meal: 'Restaurante', hotel: 'Hotel', transfer: 'Transfer', guide: 'Guía', activity: 'Actividad', lodging: 'Lodge', truffle: 'Trufa', service: 'Servicio', villa: 'Villa', expert: 'Acceso', culture: 'Cultura' };
  const PEST = { confirmada: { c: 'go', t: 'Confirmada' }, conversando: { c: 'risk', t: 'Conversando' }, pendiente: { c: 'ghost', t: 'Pendiente' } };
  function Proveedores({ s, cur, toast, openProvider }) {
    const all = BA.tripData(s.id).proveedores;
    const [tipo, setTipo] = useState('all');
    const [estados, setEstados] = useState(() => all.map(p => p.estado));
    const tipos = ['all', ...Array.from(new Set(all.map(p => p.tipo)))];
    const conf = estados.filter(e => e === 'confirmada').length;
    const conv = estados.filter(e => e === 'conversando').length;
    const pend = estados.filter(e => e === 'pendiente').length;
    function cycle(i) { const order = ['pendiente', 'conversando', 'confirmada']; setEstados(es => es.map((e, j) => j === i ? order[(order.indexOf(e) + 1) % 3] : e)); toast('Estado actualizado'); }
    return React.createElement('div', null,
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 'var(--gap)' } },
        [['Confirmadas', conf, 'go'], ['Conversando', conv, 'risk'], ['Pendientes', pend, 'ghost']].map(([t, n, c], i) =>
          React.createElement('div', { key: i, className: 'card pad', style: { display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' } },
            React.createElement('span', { className: 'badge ' + c, style: { width: 10, height: 10, padding: 0, borderRadius: 99 } }),
            React.createElement('span', { className: 'figure', style: { fontSize: 26 } }, n),
            React.createElement('span', { style: { fontSize: 12.5, color: 'var(--text-3)' } }, t)))
      ),
      React.createElement('div', { style: { display: 'flex', gap: 7, marginBottom: 14, flexWrap: 'wrap' } },
        tipos.map(t => React.createElement('button', { key: t, className: 'badge ' + (tipo === t ? 'go' : 'ghost'), style: { cursor: 'pointer', padding: '6px 11px' }, onClick: () => setTipo(t) }, t === 'all' ? 'Todos' : PT[t]))),
      React.createElement('div', { className: 'card pad' },
        React.createElement('table', { className: 'tbl' },
          React.createElement('thead', null, React.createElement('tr', null,
            ['Proveedor', 'Tipo', 'Lugar', 'Precio', 'Cierra', 'Estado', ''].map((h, i) => React.createElement('th', { key: i, style: i === 3 ? { textAlign: 'right' } : null }, h)))),
          React.createElement('tbody', null, all.map((p, i) => (tipo === 'all' || p.tipo === tipo) && React.createElement('tr', { key: i, className: 'click', onClick: () => openProvider && openProvider('p1') },
            React.createElement('td', null, React.createElement('span', { className: 'nm' }, p.nombre),
              p.michelin > 0 && React.createElement('span', { style: { color: 'var(--brass)', marginLeft: 6 } }, '★'.repeat(p.michelin))),
            React.createElement('td', null, PT[p.tipo]),
            React.createElement('td', null, p.lugar),
            React.createElement('td', { className: 'mono', style: { textAlign: 'right' } }, p.precioUSD ? M(p.precioUSD, cur) : '—'),
            React.createElement('td', { className: 'mono' }, p.cierra),
            React.createElement('td', null, React.createElement('button', { className: 'badge ' + PEST[estados[i]].c, style: { cursor: 'pointer' }, onClick: e => { e.stopPropagation(); cycle(i); } }, PEST[estados[i]].t)),
            React.createElement('td', { style: { textAlign: 'right', whiteSpace: 'nowrap' } },
              React.createElement('span', { style: { display: 'inline-flex', gap: 4 } },
                ['phone', 'mail', 'pin'].map(ic => React.createElement('button', { key: ic, className: 'tag', style: { padding: '4px 6px' }, onClick: e => { e.stopPropagation(); toast('Abrir ' + ic); } }, React.createElement(Icon, { name: ic, style: { width: 13, height: 13 } })))))
          )))
        )
      )
    );
  }

  // ============ PRESUPUESTO ============
  function Presupuesto({ s, cur, toast }) {
    const b = BA.tripData(s.id).presupuesto;
    const colors = ['var(--laurel)', 'var(--brass)', 'var(--laurel-soft)', 'var(--curso)', 'var(--stone)', 'var(--bad)'];
    return React.createElement('div', null,
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
        [['Costo total', M(b.costoTotal, cur)], ['Costo / pax', M(b.costoPax, cur)], ['Ingreso bruto', M(b.ingreso, cur)], ['Margen', b.margen + '%']].map((c, i) =>
          React.createElement('div', { key: i, className: 'card pad', style: { padding: '16px 18px' } },
            React.createElement('div', { className: 'stat-label', style: { marginBottom: 8 } }, c[0]),
            React.createElement('div', { className: 'figure', style: { fontSize: 26, color: i === 3 ? (b.margen >= 60 ? 'var(--go)' : 'var(--bad)') : 'var(--text-1)' } }, c[1]),
            i === 3 && React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)', marginTop: 4 } }, 'objetivo 60–70%')))
      ),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', alignItems: 'start' } },
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Líneas de costo', right: React.createElement('button', { className: 'btn sm', onClick: () => toast('Línea agregada') }, React.createElement(Icon, { name: 'plus' }), 'Agregar') }),
          React.createElement('table', { className: 'tbl' },
            React.createElement('thead', null, React.createElement('tr', null, ['Categoría', 'Monto', '%'].map((h, i) => React.createElement('th', { key: i, style: i ? { textAlign: 'right' } : null }, h)))),
            React.createElement('tbody', null, b.lineas.map((l, i) => React.createElement('tr', { key: i },
              React.createElement('td', null, React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 8 } }, React.createElement('i', { style: { width: 9, height: 9, borderRadius: 3, background: colors[i], display: 'inline-block' } }), React.createElement('span', { className: 'nm' }, l.cat))),
              React.createElement('td', { className: 'mono', style: { textAlign: 'right' } }, M(l.montoUSD, cur)),
              React.createElement('td', { className: 'mono', style: { textAlign: 'right', color: 'var(--text-3)' } }, Math.round(l.pct * 100) + '%'))))
          )
        ),
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Distribución' }),
          React.createElement('div', { className: 'donut-wrap' },
            React.createElement('div', { className: 'donut' },
              React.createElement(Donut, { segments: b.lineas.map((l, i) => ({ v: l.montoUSD, color: colors[i] })), size: 116, thick: 16 }),
              React.createElement('div', { className: 'donut-center' },
                React.createElement('div', { className: 'big', style: { fontSize: 20 } }, b.margen + '%'),
                React.createElement('div', { className: 'sm' }, 'margen'))),
            React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 7 } },
              b.lineas.map((l, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5 } },
                React.createElement('i', { style: { width: 8, height: 8, borderRadius: 2, background: colors[i] } }),
                React.createElement('span', { style: { flex: 1, color: 'var(--text-2)' } }, l.cat),
                React.createElement('span', { className: 'mono', style: { color: 'var(--text-3)' } }, Math.round(l.pct * 100) + '%')))))
        )
      )
    );
  }

  // ============ RESERVAS ============
  function Reservas({ s, cur, toast }) {
    const { confirmados, pipeline } = BA.tripData(s.id).reservas;
    return React.createElement('div', null,
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, padding: '11px 15px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', marginBottom: 16, fontSize: 12.5, color: 'var(--text-2)', border: '1px solid var(--rule)' } },
        React.createElement(Icon, { name: 'funnel', style: { width: 16, height: 16, color: 'var(--accent)' } }), 'Misma data que Ventas, otra lente: el pipeline central filtrado por esta salida.'),
      React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
        React.createElement(CardHead, { title: 'Reservas confirmadas', count: confirmados.length }),
        React.createElement('table', { className: 'tbl' },
          React.createElement('thead', null, React.createElement('tr', null, ['Huésped', 'Pax', 'Cuota', 'Pagado', 'Restricciones', 'Movilidad', ''].map((h, i) => React.createElement('th', { key: i }, h)))),
          React.createElement('tbody', null, confirmados.map((c, i) => React.createElement('tr', { key: i },
            React.createElement('td', null, React.createElement('span', { className: 'nm' }, c.nombre)),
            React.createElement('td', { className: 'mono' }, c.pax),
            React.createElement('td', null, React.createElement('span', { className: 'badge ' + (c.cuota === 'Pagado' ? 'go' : 'risk'), style: { padding: '2px 7px' } }, c.cuota)),
            React.createElement('td', null, React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
              React.createElement('div', { className: 'bar', style: { width: 60 } }, React.createElement('span', { style: { width: c.pagado + '%', background: c.pagado === 100 ? 'var(--go)' : 'var(--brass)' } })),
              React.createElement('span', { className: 'mono', style: { fontSize: 11, color: 'var(--text-3)' } }, c.pagado + '%'))),
            React.createElement('td', { style: { color: c.alergias !== '—' ? 'var(--bad)' : 'var(--text-3)' } }, c.alergias),
            React.createElement('td', null, c.movilidad),
            React.createElement('td', { style: { textAlign: 'right' } }, React.createElement('button', { className: 'btn sm', onClick: () => toast('Ficha de ' + c.nombre) }, 'Perfil')))))
        )
      ),
      React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title: 'En pipeline para esta salida', count: pipeline.length }),
        pipeline.length ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 0 } },
          pipeline.map((l, i) => React.createElement('div', { key: i, className: 'row' },
            React.createElement(Avatar, { id: l.resp, size: 28 }),
            React.createElement('div', { style: { flex: 1, minWidth: 0 } },
              React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-1)' } }, l.nombre),
              React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)' } }, l.etapa + ' · ' + l.next)),
            React.createElement('span', { className: 'mono', style: { fontSize: 12, color: 'var(--accent)', fontWeight: 600 } }, 'US$ ' + l.potUSD + 'k'),
            React.createElement('button', { className: 'btn sm primary', onClick: () => toast(l.nombre + ' → reserva') }, 'Convertir')))
        ) : React.createElement('div', { style: { fontSize: 13, color: 'var(--text-3)', padding: '6px 0' } }, 'Sin leads en pipeline para esta salida.')
      )
    );
  }

  // ============ TAREAS ============
  const TT = { reserva: 'Reserva', compra: 'Compra', contacto: 'Contacto', research: 'Research', logística: 'Logística', otro: 'Otro' };
  function Tareas({ s, toast }) {
    const [items, setItems] = useState(() => BA.tripData(s.id).tareas.map((t, i) => ({ ...t, id: i })));
    const [filtro, setFiltro] = useState('all');
    function toggle(id) { setItems(L => L.map(t => t.id === id ? { ...t, done: !t.done } : t)); }
    const list = items.filter(t => filtro === 'all' ? true : filtro === 'pend' ? !t.done : t.p === filtro);
    const PCOL = { P1: 'bad', P2: 'risk', P3: 'ghost' };
    return React.createElement('div', null,
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14, flexWrap: 'wrap' } },
        React.createElement('div', { style: { display: 'flex', gap: 7, flexWrap: 'wrap' } },
          [['all', 'Todas'], ['pend', 'Pendientes'], ['P1', 'P1'], ['P2', 'P2'], ['P3', 'P3']].map(([k, t]) =>
            React.createElement('button', { key: k, className: 'badge ' + (filtro === k ? 'go' : 'ghost'), style: { cursor: 'pointer', padding: '6px 11px' }, onClick: () => setFiltro(k) }, t))),
        React.createElement('button', { className: 'btn sm primary', onClick: () => toast('Tarea agregada') }, React.createElement(Icon, { name: 'plus' }), 'Agregar tarea')),
      React.createElement('div', { className: 'card pad' },
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 0 } },
          list.map(t => React.createElement('div', { key: t.id, className: 'row', style: { gap: 13 } },
            React.createElement('button', { onClick: () => toggle(t.id), style: { width: 22, height: 22, borderRadius: 7, flexShrink: 0, border: '1.6px solid ' + (t.done ? 'var(--go)' : 'var(--rule-strong)'), background: t.done ? 'var(--go)' : 'transparent', display: 'grid', placeItems: 'center', color: '#fff' } },
              t.done && React.createElement(Icon, { name: 'check', style: { width: 13, height: 13, strokeWidth: 3 } })),
            React.createElement('span', { style: { flex: 1, fontSize: 13.5, color: t.done ? 'var(--text-faint)' : 'var(--text-1)', textDecoration: t.done ? 'line-through' : 'none' } }, t.t),
            React.createElement('span', { className: 'tag', style: { padding: '2px 8px' } }, TT[t.tipo]),
            React.createElement('span', { className: 'badge ' + PCOL[t.p], style: { padding: '2px 7px' } }, t.p)))
        )
      )
    );
  }

  // ============ APP CLIENTE ============
  function AppCliente({ s, toast }) {
    const code = s.etiqueta.replace('·', '-');
    const { confirmados } = BA.tripData(s.id).reservas;
    return React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', alignItems: 'start' } },
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--gap)' } },
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Acceso del huésped' }),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', marginBottom: 12 } },
            React.createElement('div', null, React.createElement('div', { className: 'eyebrow' }, 'Código de reserva'),
              React.createElement('div', { className: 'mono', style: { fontSize: 20, color: 'var(--text-1)', marginTop: 4, letterSpacing: '0.12em' } }, code)),
            React.createElement('button', { className: 'btn sm', onClick: () => toast('Código copiado') }, React.createElement(Icon, { name: 'copy' }), 'Copiar')),
          React.createElement('div', { style: { display: 'flex', gap: 9 } },
            React.createElement('button', { className: 'btn', style: { flex: 1 }, onClick: () => toast('Link copiado') }, React.createElement(Icon, { name: 'copy' }), 'Copiar link'),
            React.createElement('button', { className: 'btn', style: { flex: 1 }, onClick: () => toast('Código regenerado — el anterior queda inválido') }, React.createElement(Icon, { name: 'refresh' }), 'Regenerar')),
          React.createElement('button', { className: 'btn primary', style: { width: '100%', marginTop: 9 }, onClick: () => toast('Invitación enviada') }, React.createElement(Icon, { name: 'send' }), 'Invitar huésped')
        ),
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Perfiles recibidos', count: confirmados.length }),
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 0 } },
            confirmados.map((c, i) => React.createElement('div', { key: i, className: 'row' },
              React.createElement('span', { className: 'av', style: { background: 'var(--laurel)' } }, c.nombre[0]),
              React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-1)' } }, c.nombre),
                React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)' } }, 'Restricciones: ' + c.alergias + ' · Movilidad: ' + c.movilidad)),
              React.createElement('span', { className: 'badge ' + (c.alergias !== '—' ? 'risk' : 'go'), style: { padding: '2px 7px' } }, c.alergias !== '—' ? 'Atención' : 'OK'))))
        )
      ),
      // phone preview (capa narrativa)
      React.createElement('div', { className: 'card pad', style: { display: 'grid', placeItems: 'center' } },
        React.createElement('div', { className: 'eyebrow', style: { alignSelf: 'flex-start', marginBottom: 14 } }, 'Vista del cliente'),
        React.createElement('div', { style: { width: 270, borderRadius: 30, border: '8px solid var(--ink)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', background: 'var(--laurel-deep)' } },
          React.createElement('div', { style: { height: 150, background: 'linear-gradient(150deg, var(--laurel-soft), var(--laurel-deep))', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 16 } },
            React.createElement('div', { style: { fontFamily: 'var(--ff-mono)', fontSize: 8, letterSpacing: '0.16em', color: 'var(--brass-soft)', textTransform: 'uppercase' } }, 'Blisniuk & Amanov'),
            React.createElement('div', { style: { fontFamily: 'var(--ff-display)', fontSize: 20, color: 'var(--bone)', lineHeight: 1.1, marginTop: 4 } }, s.titulo)),
          React.createElement('div', { style: { background: 'var(--surface)', padding: 16 } },
            React.createElement('div', { style: { fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)', marginBottom: 8 } }, s.fecha),
            ['Llegada · ' + s.region, 'Día 1 · primeros pasos', 'Día 2 · el corazón del viaje'].map((t, i) =>
              React.createElement('div', { key: i, style: { display: 'flex', gap: 9, padding: '8px 0', borderTop: i ? '1px solid var(--rule-soft)' : 'none' } },
                React.createElement('span', { className: 'mono', style: { fontSize: 10, color: 'var(--brass)' } }, '0' + (i + 1)),
                React.createElement('span', { style: { fontSize: 12, color: 'var(--text-1)' } }, t)))
          )
        )
      )
    );
  }

  // ============ CONFIG DEL VIAJE ============
  function Field({ label, value, wide, mono }) {
    return React.createElement('div', { style: { gridColumn: wide ? '1 / -1' : 'auto' } },
      React.createElement('label', { className: 'eyebrow', style: { display: 'block', marginBottom: 6 } }, label),
      React.createElement('input', { defaultValue: value, style: { width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--rule)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: 13, fontFamily: mono ? 'var(--ff-mono)' : 'var(--ff-body)' } }));
  }
  function CfgCard({ title, children, cols }) {
    return React.createElement('div', { className: 'card pad' },
      React.createElement(CardHead, { title }),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(' + (cols || 2) + ', 1fr)', gap: 14 } }, children));
  }
  function ConfigViaje({ s, toast }) {
    const noches = parseInt((s.fecha.match(/\d+/g) || [1, 7])[1]) - parseInt((s.fecha.match(/\d+/g) || [1])[0]) || 6;
    const code = s.etiqueta.replace('·', '-');
    const huespedes = BA.tripData(s.id).reservas.confirmados;
    return React.createElement('div', { className: 'grid' },
      React.createElement(CfgCard, { title: 'Identidad' },
        React.createElement(Field, { label: 'Título', value: s.titulo, wide: true }),
        React.createElement(Field, { label: 'Etiqueta corta', value: s.etiqueta, mono: true }),
        React.createElement(Field, { label: 'Categoría', value: s.cat }),
        React.createElement(Field, { label: 'Región', value: s.region }),
        React.createElement(Field, { label: 'País', value: s.pais })
      ),
      React.createElement(CfgCard, { title: 'Fechas y grupo' },
        React.createElement(Field, { label: 'Período', value: s.fecha, wide: true, mono: true }),
        React.createElement(Field, { label: 'Noches', value: String(Math.abs(noches)), mono: true }),
        React.createElement(Field, { label: 'Pax total', value: String(s.conf + s.opcion + s.libres), mono: true }),
        React.createElement(Field, { label: 'Mínimo (break-even)', value: String(s.min), mono: true }),
        React.createElement(Field, { label: 'Precio / pax (USD)', value: String(s.precioUSD), mono: true })
      ),
      React.createElement(CfgCard, { title: 'Basecamp y monedas' },
        React.createElement(Field, { label: 'Basecamp', value: s.region + ' centro', wide: true }),
        React.createElement(Field, { label: 'Moneda base', value: 'EUR', mono: true }),
        React.createElement(Field, { label: 'Tipo de cambio EUR→USD', value: '1.08', mono: true })
      ),
      React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title: 'Acceso del cliente' }),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '13px 15px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', marginBottom: 12, flexWrap: 'wrap' } },
          React.createElement('div', null, React.createElement('div', { className: 'eyebrow' }, 'Código de acceso'),
            React.createElement('div', { className: 'mono', style: { fontSize: 19, color: 'var(--text-1)', marginTop: 3, letterSpacing: '0.12em' } }, code)),
          React.createElement('div', { style: { display: 'flex', gap: 8 } },
            React.createElement('button', { className: 'btn sm', onClick: () => toast('Mensaje de invitación copiado') }, React.createElement(Icon, { name: 'copy' }), 'Copiar invitación'),
            React.createElement('button', { className: 'btn sm', onClick: () => toast('Vista de cliente') }, React.createElement(Icon, { name: 'eye' }), 'Ver como cliente'),
            React.createElement('button', { className: 'btn sm primary', onClick: () => toast('Código regenerado — el anterior queda inválido') }, React.createElement(Icon, { name: 'refresh' }), 'Regenerar'))
        )
      ),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', alignItems: 'start' } },
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Operadores', right: React.createElement('button', { className: 'btn sm', onClick: () => toast('Invitar operador') }, React.createElement(Icon, { name: 'plus' }), 'Agregar') }),
          BA.operadores.map((o, i) => React.createElement('div', { key: i, className: 'row' },
            React.createElement(Avatar, { id: o.id, size: 30 }),
            React.createElement('div', { style: { flex: 1 } }, React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-1)' } }, o.name),
              React.createElement('div', { style: { fontSize: 11, color: 'var(--text-3)' } }, o.id === s.resp ? 'Responsable · última entrada hoy' : 'Operador')),
            o.id === s.resp && React.createElement('span', { className: 'badge go' }, 'Responsable')))
        ),
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Huéspedes', count: huespedes.length, right: React.createElement('button', { className: 'btn sm', onClick: () => toast('Invitar huésped') }, React.createElement(Icon, { name: 'plus' }), 'Invitar') }),
          huespedes.map((h, i) => React.createElement('div', { key: i, className: 'row' },
            React.createElement('span', { className: 'av', style: { background: 'var(--laurel)' } }, h.nombre[0]),
            React.createElement('div', { style: { flex: 1 } }, React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-1)' } }, h.nombre),
              React.createElement('div', { style: { fontSize: 11, color: 'var(--text-3)' } }, h.alergias !== '—' ? 'Restricción: ' + h.alergias : 'Sin restricciones')),
            React.createElement('span', { className: 'badge ' + (h.alergias !== '—' ? 'risk' : 'ghost') }, h.pax + ' pax')))
        )
      )
    );
  }

  Object.assign(window, { Itinerario, Ruta, Proveedores, Presupuesto, Reservas, Tareas, AppCliente, ConfigViaje });
})();
