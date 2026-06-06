/* B&A · Proveedores del viaje V2: 3 vistas (tarjetas/tabla/pipeline) + Barrer ahora → window.Proveedores (override) */
(function () {
  const { Icon, StatCard, CardHead } = window;
  const { useState } = React;
  const BA = window.BA;
  const M = (usd, cur) => BA.money(usd, cur);
  const PT = { restaurant: 'Restaurante', winery: 'Bodega', wine: 'Bodega', meal: 'Restaurante', hotel: 'Hotel', transfer: 'Transfer', guide: 'Guía', activity: 'Actividad', lodging: 'Lodge', truffle: 'Trufa', service: 'Servicio', villa: 'Villa', expert: 'Acceso', culture: 'Cultura' };
  const PEST = { confirmada: { c: 'go', t: 'Confirmada' }, conversando: { c: 'risk', t: 'Conversando' }, pendiente: { c: 'ghost', t: 'Pendiente' } };
  const STAGES = ['pendiente', 'conversando', 'confirmada'];
  const ST_LBL = { pendiente: 'Pendiente', conversando: 'Conversando', confirmada: 'Confirmada' };

  function Proveedores({ s, cur, toast, openProvider }) {
    const base = BA.tripData(s.id).proveedores;
    const [items, setItems] = useState(() => base.map(p => ({ ...p, geo: p.lat != null && p.lng != null })));
    const [vista, setVista] = useState('cards'); // cards | table | pipeline
    const [tipo, setTipo] = useState('all');
    const [barriendo, setBarriendo] = useState(false);
    const tipos = ['all', ...Array.from(new Set(items.map(p => p.tipo)))];
    const sinGeo = items.filter(p => !p.geo).length;
    function cycle(id) { toast('La edición de estado del proveedor llega en el próximo paso (se guardará en el viaje).'); }
    function barrer() { toast('El barrido real de Google Places (geolocalizar lo que falte) se activa al configurar la API key. Lo armo a continuación.'); }
    const list = items.filter(p => tipo === 'all' || p.tipo === tipo);
    const conf = items.filter(p => p.estado === 'confirmada').length;

    const toolbar = React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14, flexWrap: 'wrap' } },
      React.createElement('div', { className: 'seg-tabs', style: { maxWidth: 280 } },
        [['cards', 'Tarjetas'], ['table', 'Tabla'], ['pipeline', 'Pipeline']].map(([k, t]) => React.createElement('button', { key: k, className: vista === k ? 'on' : '', onClick: () => setVista(k) }, t))),
      React.createElement('div', { style: { display: 'flex', gap: 8 } },
        React.createElement('button', { className: 'btn sm', disabled: barriendo || sinGeo === 0, style: (barriendo || sinGeo === 0) ? { opacity: .5 } : null, onClick: barrer },
          React.createElement(Icon, { name: barriendo ? 'refresh' : 'pin' }), barriendo ? 'Barriendo…' : 'Barrer ahora' + (sinGeo ? ' (' + sinGeo + ')' : '')),
        React.createElement('button', { className: 'btn sm primary', onClick: () => toast('Alta de proveedor: llega en el próximo paso.') }, React.createElement(Icon, { name: 'plus' }), 'Agregar')));

    let viewEl;
    if (vista === 'cards') {
      // agrupado por tipo
      const groups = {};
      list.forEach(p => { (groups[p.tipo] = groups[p.tipo] || []).push(p); });
      viewEl = Object.entries(groups).map(([tp, arr]) => React.createElement('div', { key: tp, style: { marginBottom: 22 } },
        React.createElement('div', { className: 'eyebrow', style: { marginBottom: 10 } }, PT[tp] + ' · ' + arr.length),
        React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' } },
          arr.map(p => { const st = PEST[p.estado];
            return React.createElement('div', { key: p.id, className: 'card pad rise', style: { cursor: 'pointer' }, onClick: () => openProvider && openProvider(p.id) },
              React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 11, marginBottom: 12 } },
                React.createElement('span', { className: 'salida-glyph', style: { width: 38, height: 38, borderRadius: 11, fontSize: 15, background: 'linear-gradient(145deg, var(--laurel-soft), var(--laurel-deep))' } }, p.nombre[0]),
                React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                  React.createElement('div', { style: { fontSize: 13.5, fontWeight: 650, color: 'var(--text-1)', lineHeight: 1.25 } }, p.nombre, p.michelin > 0 && React.createElement('span', { style: { color: 'var(--brass)' } }, ' ' + '★'.repeat(p.michelin))),
                  React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 } }, p.lugar)),
                !p.geo && React.createElement('span', { title: 'Sin coordenadas', style: { color: 'var(--brass)' } }, React.createElement(Icon, { name: 'pin', style: { width: 15, height: 15 } }))),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 } },
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
                  React.createElement('span', { className: 'mono', style: { fontSize: 12, color: 'var(--text-2)' } }, p.precioUSD ? M(p.precioUSD, cur) : '—'),
                  p.mapUrl && React.createElement('a', { href: p.mapUrl, target: '_blank', rel: 'noopener', onClick: e => e.stopPropagation(), style: { fontSize: 11, color: 'var(--laurel)', display: 'inline-flex', alignItems: 'center', gap: 3, textDecoration: 'none' } }, React.createElement(Icon, { name: 'pin', style: { width: 12, height: 12 } }), 'Mapa')),
                React.createElement('button', { className: 'badge ' + st.c, style: { cursor: 'pointer' }, onClick: e => { e.stopPropagation(); cycle(p.id); } }, st.t)));
          }))));
    } else if (vista === 'table') {
      viewEl = React.createElement('div', { className: 'card pad' }, React.createElement('table', { className: 'tbl' },
        React.createElement('thead', null, React.createElement('tr', null, ['Proveedor', 'Tipo', 'Lugar', 'Precio', 'Geo', 'Estado'].map((h, i) => React.createElement('th', { key: i, style: i === 3 ? { textAlign: 'right' } : null }, h)))),
        React.createElement('tbody', null, list.map(p => { const st = PEST[p.estado];
          return React.createElement('tr', { key: p.id, className: 'click', onClick: () => openProvider && openProvider(p.id) },
            React.createElement('td', null, React.createElement('span', { className: 'nm' }, p.nombre), p.michelin > 0 && React.createElement('span', { style: { color: 'var(--brass)', marginLeft: 5 } }, '★'.repeat(p.michelin))),
            React.createElement('td', null, PT[p.tipo]),
            React.createElement('td', null, p.lugar),
            React.createElement('td', { className: 'mono', style: { textAlign: 'right' } }, p.precioUSD ? M(p.precioUSD, cur) : '—'),
            React.createElement('td', null, p.geo ? React.createElement(Icon, { name: 'check', style: { width: 15, height: 15, color: 'var(--go)' } }) : React.createElement(Icon, { name: 'pin', style: { width: 15, height: 15, color: 'var(--brass)' } })),
            React.createElement('td', null, React.createElement('button', { className: 'badge ' + st.c, style: { cursor: 'pointer' }, onClick: e => { e.stopPropagation(); cycle(p.id); } }, st.t)));
        }))));
    } else {
      viewEl = React.createElement('div', { className: 'kanban' },
        STAGES.map(stg => { const col = list.filter(p => p.estado === stg);
          return React.createElement('div', { key: stg, className: 'kcol' },
            React.createElement('div', { className: 'kcol-head' },
              React.createElement('span', { className: 'nm' }, React.createElement('i', { style: { background: stg === 'confirmada' ? 'var(--go)' : stg === 'conversando' ? 'var(--brass)' : 'var(--stone)' } }), ST_LBL[stg]),
              React.createElement('span', { className: 'ct' }, col.length)),
            col.map(p => React.createElement('div', { key: p.id, className: 'kcard', onClick: () => openProvider && openProvider(p.id) },
              React.createElement('div', { className: 'nm' }, p.nombre),
              React.createElement('div', { className: 'sub' }, PT[p.tipo] + ' · ' + p.lugar),
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 } },
                React.createElement('span', { className: 'pot' }, p.precioUSD ? M(p.precioUSD, cur) : '—'),
                stg !== 'confirmada' && React.createElement('button', { className: 'tag', style: { padding: '2px 8px' }, onClick: e => { e.stopPropagation(); cycle(p.id); } }, 'Avanzar')))));
        }));
    }

    return React.createElement('div', null,
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
        React.createElement(StatCard, { icon: 'users', iconCls: '', label: 'Proveedores', value: items.length, sub: 'en el viaje' }),
        React.createElement(StatCard, { icon: 'check', iconCls: 'tint', label: 'Confirmados', value: conf, sub: 'reserva cerrada' }),
        React.createElement(StatCard, { icon: 'clock', iconCls: 'tint-brass', label: 'Conversando', value: items.filter(p => p.estado === 'conversando').length, sub: 'en gestión' }),
        React.createElement(StatCard, { icon: 'pin', iconCls: sinGeo ? 'tint-bad' : 'tint', label: 'Sin geo', value: sinGeo, sub: sinGeo ? 'usá «Barrer ahora»' : 'todo geolocalizado' })),
      React.createElement('div', { style: { display: 'flex', gap: 7, marginBottom: 14, flexWrap: 'wrap' } },
        tipos.map(tp => React.createElement('button', { key: tp, className: 'badge ' + (tipo === tp ? 'go' : 'ghost'), style: { cursor: 'pointer', padding: '6px 11px' }, onClick: () => setTipo(tp) }, tp === 'all' ? 'Todos' : PT[tp]))),
      toolbar,
      viewEl
    );
  }

  window.Proveedores = Proveedores;
})();
