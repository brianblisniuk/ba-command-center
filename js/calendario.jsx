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

  const { useState } = React;
  function toDate(v){ if(!v) return null; const t=String(v).trim(); if(!t || t==='\u2014') return null; const d=new Date(t.length<=10? t+'T00:00:00': t); return isNaN(d.getTime())? null : d; }
  function addDays(b,n){ const d=new Date(b.getTime()); d.setDate(d.getDate()+n); return d; }
  const MESES=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  function Calendario({ openTrip, toast }) {
    const today=new Date(); today.setHours(0,0,0,0);
    const [cur,setCur]=useState({ y: today.getFullYear(), m: today.getMonth() });
    const inMonth=d => d && d.getFullYear()===cur.y && d.getMonth()===cur.m;

    // ---- eventos REALES del mes mostrado ----
    const events=[];
    (BA.salidas||[]).forEach(s => {
      const d=toDate(s.startISO);
      if (inMonth(d)) events.push({ day:d.getDate(), tipo:'salida', label:'Sale \u00b7 '+(s.titulo||s.region||'Viaje'), salida:s.id });
      const dd=toDate(s.decisionDate);
      if (inMonth(dd) && s.estado!=='nogo' && s.estado!=='curso') events.push({ day:dd.getDate(), tipo:'decision', label:'GO/NO-GO \u00b7 '+(s.titulo||s.region||'Viaje'), salida:s.id });
    });
    ((BA.finanzas&&BA.finanzas.cuotas)||[]).forEach(c => {
      if (c.estado==='pagado') return;
      let d=toDate(c.vence);
      if (!d && typeof c.dias==='number') d=addDays(today, c.dias);
      if (inMonth(d)) events.push({ day:d.getDate(), tipo:'cobro', label:'Cobro \u00b7 '+(c.cliente||'\u2014')+' \u00b7 '+BA.money(c.monto, c.currency||'USD'), salida:c.salida });
    });
    (BA.accesos||[]).forEach(a => {
      const d=toDate(a.deadline);
      if (inMonth(d)) events.push({ day:d.getDate(), tipo:'acceso', label:'Deadline \u00b7 '+(a.figura||a.nombre||'Acceso'), salida:a.salida });
    });

    const byDay={}, counts={};
    events.forEach(e => { (byDay[e.day]=byDay[e.day]||[]).push(e); counts[e.tipo]=(counts[e.tipo]||0)+1; });

    const firstDow=(new Date(cur.y,cur.m,1).getDay()+6)%7; // lunes=0
    const daysInMonth=new Date(cur.y,cur.m+1,0).getDate();
    const isTodayMonth=cur.y===today.getFullYear() && cur.m===today.getMonth();
    const cells=[];
    for (let i=0;i<firstDow;i++) cells.push(null);
    for (let d=1;d<=daysInMonth;d++) cells.push(d);
    while (cells.length%7!==0) cells.push(null);

    const shift=n => setCur(c => { let m=c.m+n, y=c.y; while(m<0){m+=12;y--;} while(m>11){m-=12;y++;} return {y,m}; });
    const goToday=() => setCur({ y: today.getFullYear(), m: today.getMonth() });
    function evClick(e){ const sa=BA.salidaById(e.salida); if(sa) openTrip(e.salida); else toast(e.label); }

    const navBtns=React.createElement('div', { style:{ display:'flex', gap:6, alignItems:'center' } },
      !isTodayMonth && React.createElement('button', { className:'btn sm', style:{ marginRight:2 }, onClick: goToday }, 'Hoy'),
      React.createElement('button', { className:'tb-icon', style:{ width:32, height:32 }, title:'Mes anterior', onClick: () => shift(-1) }, React.createElement(Icon, { name:'cl' })),
      React.createElement('button', { className:'tb-icon', style:{ width:32, height:32 }, title:'Mes siguiente', onClick: () => shift(1) }, React.createElement(Icon, { name:'cr' })));

    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' }, React.createElement('div', null,
        React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Calendario operativo')),
        React.createElement('div', { className: 'page-greet-sub' }, 'Todo el negocio en una grilla \u2014 salidas, cobros, accesos y decisiones, derivado de tus datos'))),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(5,1fr)', marginBottom: 'var(--gap)' } },
        Object.entries(TYPE).map(([k, v]) => React.createElement('div', { key: k, className: 'card pad', style: { padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 } },
          React.createElement('span', { style: { width: 38, height: 38, borderRadius: 11, flexShrink: 0, display: 'grid', placeItems: 'center', background: 'color-mix(in oklab,' + v.c + ' 16%, transparent)', color: v.c } }, React.createElement(Icon, { name: v.ic })),
          React.createElement('div', null,
            React.createElement('div', { className: 'figure', style: { fontSize: 22 } }, counts[k] || 0),
            React.createElement('div', { className: 'stat-label' }, v.t))))
      ),
      React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title: MESES[cur.m] + ' ' + cur.y, right: navBtns }),
        React.createElement('div', { className: 'cal-grid', style: { marginBottom: 8 } },
          DOW.map(d => React.createElement('div', { key: d, className: 'cal-dow' }, d))),
        React.createElement('div', { className: 'cal-grid' },
          cells.map((d, i) => {
            if (d == null) return React.createElement('div', { key: i, className: 'cal-cell blank' });
            const evs = byDay[d] || [];
            const isToday = isTodayMonth && d === today.getDate();
            return React.createElement('div', { key: i, className: 'cal-cell' + (isToday ? ' today' : '') },
              React.createElement('div', { className: 'dn' }, isToday ? 'HOY \u00b7 ' + d : d),
              evs.slice(0, 3).map((e, j) => React.createElement('div', { key: j, className: 'cal-ev', style: { borderLeftColor: TYPE[e.tipo].c }, title: e.label, onClick: () => evClick(e) }, e.label)),
              evs.length > 3 && React.createElement('div', { style: { fontSize: 9.5, color: 'var(--text-faint)', fontFamily: 'var(--ff-mono)' } }, '+' + (evs.length - 3) + ' m\u00e1s'));
          })
        )
      )
    );
  }

  window.Calendario = Calendario;
})();
