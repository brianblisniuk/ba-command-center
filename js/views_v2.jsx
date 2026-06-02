/* B&A · V2: Historial · Biblioteca (real) · Clientes · Configuración → window (override) */
(function () {
  const { Icon, StatCard, Badge, Avatar, CardHead } = window;
  const { useState } = React;
  const BA = window.BA;
  function k(v, cur) { return BA.sym[cur] + ' ' + Math.round(v * (BA.fx[cur] / BA.fx.USD)) + 'k'; }

  // ============ HISTORIAL (bitácora de cambios) ============
  const EVT = {
    trip:     { ic: 'compass', c: 'var(--laurel)', t: 'Viaje' },
    lead:     { ic: 'funnel',  c: 'var(--curso)',  t: 'Lead' },
    payment:  { ic: 'coin',    c: 'var(--go)',     t: 'Pago' },
    provider: { ic: 'users',   c: 'var(--brass)',  t: 'Proveedor' },
    access:   { ic: 'key',     c: 'var(--brass)',  t: 'Acceso' },
    email:    { ic: 'mail',    c: 'var(--stone)',  t: 'Email' },
  };
  function Historial({ toast, openTrip }) {
    const [filtro, setFiltro] = useState('all');
    const tipos = ['all', ...Array.from(new Set(BA.changes.map(c => c.event_type)))];
    const list = BA.changes.filter(c => filtro === 'all' || c.event_type === filtro);
    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' }, React.createElement('div', null,
        React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Historial')),
        React.createElement('div', { className: 'page-greet-sub' }, 'Bitácora de todo lo que pasó · auditá cada cambio del negocio'))),
      React.createElement('div', { style: { display: 'flex', gap: 7, marginBottom: 16, flexWrap: 'wrap' } },
        tipos.map(tp => React.createElement('button', { key: tp, className: 'badge ' + (filtro === tp ? 'go' : 'ghost'), style: { cursor: 'pointer', padding: '6px 12px' }, onClick: () => setFiltro(tp) }, tp === 'all' ? 'Todo' : (EVT[tp] ? EVT[tp].t : tp)))),
      React.createElement('div', { className: 'card pad' },
        React.createElement('div', { className: 'tl' },
          list.map((c, i) => { const m = EVT[c.event_type] || EVT.trip; const s = c.trip ? BA.salidaById(c.trip) : null;
            return React.createElement('div', { key: i, className: 'tl-item' },
              React.createElement('div', { className: 'tl-dot', style: { borderColor: m.c, color: m.c, background: 'color-mix(in oklab,' + m.c + ' 14%, transparent)' } }, React.createElement(Icon, { name: m.ic })),
              React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' } },
                React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                  React.createElement('div', { className: 'tl-t' }, c.summary),
                  React.createElement('div', { className: 'tl-meta' }, React.createElement('b', null, c.author), ' · ', c.when, s ? ' · ' + s.region : '')),
                React.createElement('span', { className: 'tag', style: { cursor: s ? 'pointer' : 'default' }, onClick: () => s && openTrip(c.trip) }, React.createElement(Icon, { name: m.ic }), m.t)));
          }))
      )
    );
  }

  // ============ BIBLIOTECA de proveedores (real, abre ficha) ============
  const PT = { meal: 'Restaurante', wine: 'Bodega', lodging: 'Alojamiento', experience: 'Experiencia', transfer: 'Transfer', service: 'Servicio', villa: 'Villa' };
  const RST = { confirmada: { c: 'go', t: 'Confirmada' }, conversando: { c: 'risk', t: 'Conversando' }, pendiente: { c: 'ghost', t: 'Pendiente' } };
  function Biblioteca({ toast, openProvider, openCapture }) {
    const [tipo, setTipo] = useState('all');
    const tipos = ['all', ...Array.from(new Set(BA.biblioteca.map(p => p.type)))];
    const list = BA.biblioteca.filter(p => tipo === 'all' || p.type === tipo);
    const reutil = BA.biblioteca.filter(p => p.salidas.length > 1 || p.salidas.length === 0).length;
    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' },
        React.createElement('div', null,
          React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Biblioteca')),
          React.createElement('div', { className: 'page-greet-sub' }, 'Proveedores y figuras de acceso reutilizables entre viajes')),
        React.createElement('div', { style: { display: 'flex', gap: 8 } },
          React.createElement('button', { className: 'btn', onClick: () => openCapture && openCapture() }, React.createElement(Icon, { name: 'spark' }), 'Importar con IA'),
          React.createElement('button', { className: 'btn primary', onClick: () => toast('Nuevo proveedor') }, React.createElement(Icon, { name: 'plus' }), 'Nuevo proveedor'))),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
        React.createElement(StatCard, { icon: 'book', iconCls: '', label: 'Proveedores', value: BA.biblioteca.length, sub: 'en biblioteca' }),
        React.createElement(StatCard, { icon: 'check', iconCls: 'tint', label: 'Confirmados', value: BA.biblioteca.filter(p => p.reservationStatus === 'confirmada').length, sub: 'reserva cerrada' }),
        React.createElement(StatCard, { icon: 'key', iconCls: 'tint-brass', label: 'Accesos', value: BA.biblioteca.filter(p => p.type === 'experience').length, sub: 'figuras locales' }),
        React.createElement(StatCard, { icon: 'refresh', iconCls: 'tint', label: 'Reutilizables', value: reutil, sub: 'para otras salidas' })),
      React.createElement('div', { style: { display: 'flex', gap: 7, marginBottom: 14, flexWrap: 'wrap' } },
        tipos.map(tp => React.createElement('button', { key: tp, className: 'badge ' + (tipo === tp ? 'go' : 'ghost'), style: { cursor: 'pointer', padding: '6px 11px' }, onClick: () => setTipo(tp) }, tp === 'all' ? 'Todos' : PT[tp]))),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' } },
        list.map(p => { const st = RST[p.reservationStatus]; const s0 = p.salidas[0] ? BA.salidaById(p.salidas[0]) : null;
          return React.createElement('div', { key: p.id, className: 'card pad rise', style: { cursor: 'pointer' }, onClick: () => openProvider(p.id) },
            React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 } },
              React.createElement('span', { className: 'salida-glyph', style: { width: 40, height: 40, borderRadius: 12, fontSize: 16, background: 'linear-gradient(145deg, var(--laurel-soft), var(--laurel-deep))' } }, p.name[0]),
              React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                React.createElement('div', { style: { fontSize: 14, fontWeight: 650, color: 'var(--text-1)', lineHeight: 1.25 } }, p.name),
                React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 } }, PT[p.type] + ' · ' + p.location, p.michelin > 0 && React.createElement('span', { style: { color: 'var(--brass)' } }, ' ★'.repeat(p.michelin)))),
              React.createElement('span', { className: 'badge ' + st.c }, st.t)),
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 } },
              React.createElement('span', { style: { fontSize: 11.5, color: 'var(--text-3)' } }, s0 ? 'En ' + s0.region : 'Sin asignar', p.salidas.length > 1 ? ' +' + (p.salidas.length - 1) : ''),
              React.createElement('span', { style: { display: 'flex', gap: 5, color: 'var(--text-faint)' } },
                p.comms.length > 0 && React.createElement('span', { className: 'tag', style: { padding: '2px 7px' } }, React.createElement(Icon, { name: 'mail' }), p.comms.length),
                p.attachments.length > 0 && React.createElement('span', { className: 'tag', style: { padding: '2px 7px' } }, React.createElement(Icon, { name: 'book' }), p.attachments.length))));
        }))
    );
  }

  // ============ CLIENTES (con estado vacío diseñado en mente) ============
  function Clientes({ cur, toast }) {
    const cl = BA.clientes;
    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' }, React.createElement('div', null,
        React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Clientes')),
        React.createElement('div', { className: 'page-greet-sub' }, 'Los que ya viajaron · LTV · NPS · referidos'))),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
        React.createElement(StatCard, { icon: 'users', iconCls: '', label: 'Clientes', value: cl.length, sub: 'histórico' }),
        React.createElement(StatCard, { icon: 'coin', iconCls: 'tint', label: 'LTV total', value: k(cl.reduce((s, c) => s + c.ltvUSD, 0), cur), sub: 'pagado acumulado' }),
        React.createElement(StatCard, { icon: 'star', iconCls: 'tint-brass', label: 'NPS', value: (cl.reduce((s, c) => s + c.nps, 0) / cl.length).toFixed(1), sub: 'promedio' }),
        React.createElement(StatCard, { icon: 'spark', iconCls: 'tint', label: 'Referidos', value: cl.reduce((s, c) => s + c.trajo, 0), sub: 'traídos por clientes' })),
      React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title: 'Cartera', count: cl.length }),
        React.createElement('div', { style: { overflowX: 'auto' } }, React.createElement('table', { className: 'tbl' },
          React.createElement('thead', null, React.createElement('tr', null, ['Cliente', 'Viajes', 'LTV', 'NPS', 'Último viaje', 'Trajo', ''].map((h, i) => React.createElement('th', { key: i, style: i > 0 && i < 4 ? { textAlign: 'right' } : null }, h)))),
          React.createElement('tbody', null, cl.map((c, i) => React.createElement('tr', { key: i, className: 'click', onClick: () => toast('Ficha · ' + c.nombre) },
            React.createElement('td', null, React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 9 } }, React.createElement('span', { className: 'av', style: { width: 28, height: 28, background: 'var(--laurel)' } }, c.nombre[0]), React.createElement('span', { className: 'nm' }, c.nombre))),
            React.createElement('td', { className: 'mono', style: { textAlign: 'right' } }, c.viajes),
            React.createElement('td', { className: 'mono', style: { textAlign: 'right', color: 'var(--text-1)', fontWeight: 600 } }, k(c.ltvUSD, cur)),
            React.createElement('td', { style: { textAlign: 'right' } }, React.createElement('span', { className: 'badge go' }, c.nps)),
            React.createElement('td', null, c.ultimo),
            React.createElement('td', { className: 'mono' }, c.trajo),
            React.createElement('td', { style: { textAlign: 'right' } }, React.createElement('button', { className: 'btn sm', onClick: e => { e.stopPropagation(); toast('Invitación enviada a ' + c.nombre); } }, 'Invitar'))))))))
    );
  }

  window.Historial = Historial;
  window.Biblioteca = Biblioteca;
  window.Clientes = Clientes;
})();
