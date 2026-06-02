/* B&A · Calendario operativo unificado → window.Calendario */
(function () {
  const { Icon, StatCard, CardHead } = window;
  const BA = window.BA;
  const TYPE = {
    salida:   { c: 'var(--laurel)', ic: 'compass', t: 'Salidas' },
    cobro:    { c: 'var(--bad)',    ic: 'coin',    t: 'Cobros' },
    acceso:   { c: 'var(--brass)',  ic: 'key',     t: 'Accesos' },
    decision: { c: 'var(--curso)',  ic: 'flag',    t: 'Decisiones GO/NO-GO' },
    cadencia: { c: 'var(--stone)',  ic: 'send',    t: 'Cadencias' },
  };
  const DOW = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  function Calendario({ openTrip, toast }) {
    const { calMes, calEventos } = BA;
    const byDay = {};
    calEventos.forEach(e => { (byDay[e.day] = byDay[e.day] || []).push(e); });
    const counts = {};
    calEventos.forEach(e => counts[e.tipo] = (counts[e.tipo] || 0) + 1);
    const cells = [];
    for (let i = 0; i < calMes.inicioDow; i++) cells.push(null);
    for (let d = 1; d <= calMes.dias; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    function evClick(e) { const s = BA.salidaById(e.salida); if (s) openTrip(e.salida); else toast(e.label); }

    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' }, React.createElement('div', null,
        React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Calendario operativo')),
        React.createElement('div', { className: 'page-greet-sub' }, 'Todo el negocio en una grilla — salidas, cobros, accesos, decisiones y cadencias'))),
      // KPI strip
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(5,1fr)', marginBottom: 'var(--gap)' } },
        Object.entries(TYPE).map(([k, v]) => React.createElement('div', { key: k, className: 'card pad', style: { padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 } },
          React.createElement('span', { style: { width: 38, height: 38, borderRadius: 11, flexShrink: 0, display: 'grid', placeItems: 'center', background: 'color-mix(in oklab,' + v.c + ' 16%, transparent)', color: v.c } }, React.createElement(Icon, { name: v.ic })),
          React.createElement('div', null,
            React.createElement('div', { className: 'figure', style: { fontSize: 22 } }, counts[k] || 0),
            React.createElement('div', { className: 'stat-label' }, v.t))))
      ),
      React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title: calMes.nombre, right: React.createElement('div', { style: { display: 'flex', gap: 6 } },
          React.createElement('button', { className: 'tb-icon', style: { width: 32, height: 32 }, onClick: () => toast('Mes anterior') }, React.createElement(Icon, { name: 'cl' })),
          React.createElement('button', { className: 'tb-icon', style: { width: 32, height: 32 }, onClick: () => toast('Mes siguiente') }, React.createElement(Icon, { name: 'cr' }))) }),
        React.createElement('div', { className: 'cal-grid', style: { marginBottom: 8 } },
          DOW.map(d => React.createElement('div', { key: d, className: 'cal-dow' }, d))),
        React.createElement('div', { className: 'cal-grid' },
          cells.map((d, i) => {
            if (d == null) return React.createElement('div', { key: i, className: 'cal-cell blank' });
            const evs = byDay[d] || [];
            return React.createElement('div', { key: i, className: 'cal-cell' + (d === calMes.hoy ? ' today' : '') },
              React.createElement('div', { className: 'dn' }, d === calMes.hoy ? 'HOY · ' + d : d),
              evs.slice(0, 3).map((e, j) => React.createElement('div', { key: j, className: 'cal-ev', style: { borderLeftColor: TYPE[e.tipo].c }, title: e.label, onClick: () => evClick(e) }, e.label)),
              evs.length > 3 && React.createElement('div', { style: { fontSize: 9.5, color: 'var(--text-faint)', fontFamily: 'var(--ff-mono)' } }, '+' + (evs.length - 3) + ' más'));
          })
        )
      )
    );
  }

  window.Calendario = Calendario;
})();
