/* B&A · shared UI components → window */
(function () {
  const { Icon, Spark } = window;

  const ESTADO = {
    go:     { cls: 'go',    label: 'GO' },
    risk:   { cls: 'risk',  label: 'EN RIESGO' },
    nogo:   { cls: 'bad',   label: 'NO VA' },
    curso:  { cls: 'curso', label: 'EN CURSO' },
    opcion: { cls: 'ghost', label: 'EN OPCIÓN' },
  };
  function estadoMeta(e) { return ESTADO[e] || ESTADO.opcion; }

  function Badge({ estado, children }) {
    const m = estadoMeta(estado);
    return React.createElement('span', { className: 'badge ' + m.cls },
      React.createElement('span', { className: 'bd' }), children || m.label);
  }

  function opById(id) { return window.BA.operadores.find(o => o.id === id) || window.BA.operadores[0]; }

  function Avatar({ id, op, size }) {
    const o = op || opById(id);
    return React.createElement('span', { className: 'av', title: o.name,
      style: { background: o.color, width: size, height: size } }, o.initials);
  }

  // occupancy bar with break-even marker
  function OccBar({ s }) {
    const cap = Math.max(s.min, s.conf + s.opcion + s.libres, 1);
    const confPct = (s.conf / cap) * 100;
    const optPct = (s.opcion / cap) * 100;
    const bePct = (s.breakeven / cap) * 100;
    return React.createElement('div', { className: 'occ' },
      React.createElement('div', { className: 'occ-bar' },
        React.createElement('span', { className: 'conf', style: { width: confPct + '%' } }),
        React.createElement('span', { className: 'opt', style: { width: optPct + '%' } })),
      React.createElement('div', { className: 'occ-be', style: { left: bePct + '%' } })
    );
  }

  function SalidaCard({ s, cur, onOpen }) {
    const m = estadoMeta(s.estado);
    const brass = ['Gastro', 'Vino', 'A medida'].includes(s.cat);
    return React.createElement('div', { className: 'salida rise', onClick: () => onOpen && onOpen(s) },
      React.createElement('div', { className: 'salida-top' },
        React.createElement('div', { className: 'salida-glyph' + (brass ? ' brass' : '') }, s.glyph),
        React.createElement('div', { className: 'salida-tt' },
          React.createElement('h4', null, s.titulo),
          React.createElement('div', { className: 'meta' }, s.fecha + ' · ' + s.pais)),
        React.createElement(Badge, { estado: s.estado })
      ),
      React.createElement('div', null,
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 9, fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)' } },
          React.createElement('span', null, s.conf + ' conf · ' + s.opcion + ' opción'),
          React.createElement('span', null, 'mín ' + s.min)),
        React.createElement(OccBar, { s })
      ),
      React.createElement('div', { className: 'salida-metrics' },
        React.createElement('div', { className: 'sm-cell' },
          React.createElement('div', { className: 'v' }, s.accesosOk + '/' + s.accesosTot),
          React.createElement('div', { className: 'k' }, 'Accesos')),
        React.createElement('div', { className: 'sm-cell' },
          React.createElement('div', { className: 'v' }, s.readiness + '%'),
          React.createElement('div', { className: 'k' }, 'Readiness')),
        React.createElement('div', { className: 'sm-cell' },
          React.createElement('div', { className: 'v' }, s.dias > 0 ? s.dias + 'd' : '—'),
          React.createElement('div', { className: 'k' }, s.estado === 'curso' ? 'En viaje' : 'Decisión'))
      )
    );
  }

  // KPI stat card (Horizon-style)
  function StatCard({ icon, iconCls, label, value, unit, sub, delta, spark, sparkColor, children }) {
    return React.createElement('div', { className: 'stat rise' },
      React.createElement('div', { className: 'stat-top' },
        React.createElement('div', { className: 'stat-ic ' + (iconCls || '') }, React.createElement(Icon, { name: icon })),
        React.createElement('div', { style: { minWidth: 0 } },
          React.createElement('div', { className: 'stat-label' }, label))
      ),
      React.createElement('div', { className: 'stat-fig' }, value,
        unit && React.createElement('span', { className: 'u' }, unit)),
      spark && React.createElement(Spark, { data: spark, color: sparkColor || 'var(--accent)' }),
      React.createElement('div', { className: 'stat-foot' },
        React.createElement('span', { className: 'stat-sub' }, sub),
        delta != null && React.createElement('span', { className: 'delta ' + (delta >= 0 ? 'up' : 'down') },
          React.createElement(Icon, { name: delta >= 0 ? 'au' : 'ad' }), Math.abs(delta) + '%')
      ),
      children
    );
  }

  function CardHead({ title, count, onLink, linkLabel, right }) {
    return React.createElement('div', { className: 'card-head' },
      React.createElement('h3', null, title, count != null && React.createElement('span', { className: 'c' }, count)),
      right || (onLink && React.createElement('button', { className: 'card-link', onClick: onLink },
        linkLabel || 'Ver todo', React.createElement(Icon, { name: 'cr' })))
    );
  }

  // confetti global (celebración al completar tareas)
  window.confetti = function () {
    const cols = ['#3D5A3E', '#B8945A', '#4A6A4B', '#CBAA73', '#3F6B78'];
    const wrap = document.createElement('div');
    wrap.className = 'confetti-wrap';
    for (let i = 0; i < 60; i++) {
      const b = document.createElement('span');
      b.className = 'confetti-bit';
      b.style.left = Math.random() * 100 + 'vw';
      b.style.background = cols[i % cols.length];
      b.style.animationDuration = (1.4 + Math.random() * 1.2) + 's';
      b.style.animationDelay = (Math.random() * 0.3) + 's';
      b.style.borderRadius = Math.random() > 0.5 ? '99px' : '2px';
      wrap.appendChild(b);
    }
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 3000);
  };

  window.estadoMeta = estadoMeta;
  window.Badge = Badge;
  window.Avatar = Avatar;
  window.OccBar = OccBar;
  window.SalidaCard = SalidaCard;
  window.StatCard = StatCard;
  window.CardHead = CardHead;
  window.opById = opById;
})();
