/* B&A · Cadencias (reglas reales cadence_rules + cola derivada de leads) → window.Cadencias */
(function () {
  const { Icon, StatCard, Avatar, CardHead } = window;
  const { useState } = React;
  const BA = window.BA;
  const CH = {
    email:    { t: 'Email',    c: 'var(--curso)', ic: 'mail',  act: 'Preparar email' },
    whatsapp: { t: 'WhatsApp', c: '#1c8a52',      ic: 'chat',  act: 'Abrir WhatsApp' },
    call:     { t: 'Llamada',  c: 'var(--brass)', ic: 'phone', act: 'Ver guion' },
  };
  const STAGE_ORDER = ['Nuevos', 'Contactados', 'Calificado', 'Propuesta', 'Negociación'];

  function ChPill({ ch }) {
    const m = CH[ch] || { t: ch, c: 'var(--text-3)', ic: 'flag' };
    return React.createElement('span', { className: 'ch-pill', style: { background: 'color-mix(in oklab,' + m.c + ' 15%, transparent)', color: m.c } },
      React.createElement(Icon, { name: m.ic }), m.t);
  }

  function viajeDe(tripId) {
    const s = BA.salidaById ? BA.salidaById(tripId) : null;
    return s ? (s.region || s.titulo) : 'tu viaje';
  }
  function renderTpl(tpl, leadName, tripId) {
    const nombre = (leadName || '').replace(/^Sample\s·\s/, '').split(' ')[0] || '';
    return (tpl || '').replace(/{nombre}/g, nombre).replace(/{viaje}/g, viajeDe(tripId));
  }
  function dueLabel(iso) {
    if (!iso) return { t: '—', cls: 'ghost' };
    const d = Math.round((new Date(iso).getTime() - Date.now()) / 86400000);
    if (d < 0) return { t: 'vencido', cls: 'bad' };
    if (d === 0) return { t: 'hoy', cls: 'risk' };
    if (d === 1) return { t: 'mañana', cls: 'risk' };
    return { t: 'en ' + d + ' d', cls: 'ghost' };
  }

  function Cadencias({ nav, toast, openLead, openCompose }) {
    const reglas = (BA.cadencias && BA.cadencias.reglas) || [];
    const cola = (BA.cadencias && BA.cadencias.cola) || [];
    const [selId, setSelId] = useState(reglas[0] ? reglas[0].id : null);
    const selRule = reglas.find(r => r.id === selId) || reglas[0] || null;

    // lead de ejemplo para la vista previa: alguno de la cola que comparta etapa, o el primero de la cola
    const ejemplo = selRule ? (cola.find(c => c.stage === selRule.stage) || cola[0] || null) : (cola[0] || null);
    const exLead = ejemplo ? ejemplo.lead : 'tu cliente';
    const exTrip = ejemplo ? ejemplo.tripId : null;

    const hoy = cola.filter(c => { const d = Math.round((new Date(c.dueAt).getTime() - Date.now()) / 86400000); return d <= 0; }).length;
    const venc = cola.filter(c => new Date(c.dueAt).getTime() < Date.now() - 86400000).length;

    // reglas agrupadas por etapa (solo etapas con reglas reales)
    const byStage = {};
    reglas.forEach(r => { (byStage[r.stageLabel] = byStage[r.stageLabel] || []).push(r); });
    const stages = Object.keys(byStage).sort((a, b) => {
      const ia = STAGE_ORDER.indexOf(a), ib = STAGE_ORDER.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });

    function preparar(it, ev) {
      if (ev) ev.stopPropagation();
      const body = renderTpl(it.body, it.lead, it.tripId);
      if (it.channel === 'email') {
        const subject = renderTpl(it.subject, it.lead, it.tripId) || ('B&A · ' + viajeDe(it.tripId));
        if (openCompose) { openCompose({ to: it.email || '', account: 'reservas', subject, text: body, name: it.lead }); toast('Borrador listo para ' + it.lead.replace(/^Sample\s·\s/, '')); }
        else { navigator.clipboard && navigator.clipboard.writeText(body); toast('Copiado'); }
      } else if (it.channel === 'whatsapp') {
        const ph = (it.phone || '').replace(/\D/g, '');
        if (ph) { window.open('https://wa.me/' + ph + '?text=' + encodeURIComponent(body), '_blank'); }
        else { navigator.clipboard && navigator.clipboard.writeText(body); toast('Mensaje copiado'); }
      } else {
        navigator.clipboard && navigator.clipboard.writeText(body); toast('Guion de llamada copiado');
      }
    }
    function prepararTodos() {
      if (!cola.length) { toast('No hay toques pendientes'); return; }
      const first = cola.find(c => c.channel === 'email') || cola[0];
      preparar(first);
      if (cola.length > 1) toast(cola.length + ' toques en cola · empezá por este');
    }

    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' }, React.createElement('div', null,
        React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Cadencias')),
        React.createElement('div', { className: 'page-greet-sub' }, 'El próximo toque, automático · enganchado a Ventas y Bandeja'))),

      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
        React.createElement(StatCard, { icon: 'send', iconCls: '', label: 'En seguimiento', value: cola.length, sub: 'leads con paso pendiente' }),
        React.createElement(StatCard, { icon: 'clock', iconCls: 'tint-brass', label: 'Toques para hoy', value: hoy, sub: 'requieren acción' }),
        React.createElement(StatCard, { icon: 'alert', iconCls: 'tint-bad', label: 'Vencidos', value: venc, sub: 'pasaron su fecha' }),
        React.createElement(StatCard, { icon: 'layers', iconCls: 'tint', label: 'Reglas activas', value: reglas.length, sub: stages.length + ' etapas' })
      ),

      // reglas por etapa
      React.createElement('div', { className: 'eyebrow', style: { marginBottom: 12 } }, 'Reglas por etapa'),
      stages.length === 0
        ? React.createElement('div', { className: 'card pad', style: { marginBottom: 28 } }, React.createElement('div', { className: 'stub' },
            React.createElement('div', { className: 'ic' }, React.createElement(Icon, { name: 'layers' })),
            React.createElement('h3', null, 'Sin reglas activas'),
            React.createElement('p', null, 'Cuando definas pasos de seguimiento por etapa, aparecen acá.')))
        : React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: 28 } },
          stages.map(st => React.createElement('div', { key: st, className: 'card pad' },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 } },
              React.createElement('h3', { style: { fontSize: 15 } }, st),
              React.createElement('span', { className: 'eyebrow' }, byStage[st].length + (byStage[st].length === 1 ? ' paso' : ' pasos'))),
            byStage[st].map((r, i) => React.createElement('div', { key: r.id, onClick: () => setSelId(r.id), style: { display: 'flex', gap: 11, padding: '10px 8px', margin: '0 -8px', borderRadius: 'var(--radius-xs)', cursor: 'pointer', borderTop: i ? '1px solid var(--rule-soft)' : 'none', background: selId === r.id ? 'var(--surface-2)' : 'transparent' } },
              React.createElement('span', { style: { width: 24, height: 24, borderRadius: 8, flexShrink: 0, background: 'var(--surface-sunk)', color: 'var(--text-2)', display: 'grid', placeItems: 'center', fontFamily: 'var(--ff-mono)', fontSize: 11, fontWeight: 700 } }, r.step),
              React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-1)', fontWeight: 550 } }, r.name || r.subject || ('Paso ' + r.step)),
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 } },
                  React.createElement(ChPill, { ch: r.channel }),
                  React.createElement('span', { className: 'mono', style: { fontSize: 10.5, color: 'var(--text-3)' } }, r.offset === 0 ? 'día 0' : '+' + r.offset + ' días')))
            ))
          ))
        ),

      // preview del mensaje renderizado
      selRule && React.createElement('div', { className: 'card pad', style: { marginBottom: 28 } },
        React.createElement(CardHead, { title: 'Vista previa del mensaje', right: React.createElement('span', { className: 'eyebrow' }, 'variables resueltas') }),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' } },
          React.createElement('span', { className: 'badge ghost' }, selRule.stageLabel + ' · paso ' + selRule.step),
          React.createElement(ChPill, { ch: selRule.channel }),
          React.createElement('span', { style: { fontSize: 12, color: 'var(--text-3)' } }, 'ejemplo con '),
          React.createElement('b', { style: { fontSize: 12.5, color: 'var(--text-1)' } }, exLead.replace(/^Sample\s·\s/, ''))),
        selRule.subject && React.createElement('div', { style: { fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--text-3)', marginBottom: 8 } }, 'Asunto: ', React.createElement('span', { style: { color: 'var(--text-1)' } }, renderTpl(selRule.subject, exLead, exTrip))),
        React.createElement('div', { style: { background: 'var(--surface-2)', border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', padding: 16, fontSize: 13.5, lineHeight: 1.65, color: 'var(--text-1)', whiteSpace: 'pre-wrap' } }, renderTpl(selRule.body, exLead, exTrip) || '(sin cuerpo)'),
        React.createElement('div', { style: { display: 'flex', gap: 9, marginTop: 14, flexWrap: 'wrap' } },
          ejemplo && React.createElement('button', { className: 'btn primary', onClick: () => preparar(ejemplo) }, React.createElement(Icon, { name: CH[selRule.channel].ic }), CH[selRule.channel].act + ' · ' + exLead.replace(/^Sample\s·\s/, '').split(' ')[0]),
          React.createElement('button', { className: 'btn', onClick: () => { navigator.clipboard && navigator.clipboard.writeText(renderTpl(selRule.body, exLead, exTrip)); toast('Copiado'); } }, React.createElement(Icon, { name: 'copy' }), 'Copiar'))
      ),

      // próximo toque (cola real)
      React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title: 'Próximo toque', count: cola.length, right: cola.length > 0 && React.createElement('button', { className: 'btn sm primary', onClick: prepararTodos }, React.createElement(Icon, { name: 'spark' }), 'Preparar todos') }),
        cola.length === 0
          ? React.createElement('div', { className: 'stub' },
              React.createElement('div', { className: 'ic' }, React.createElement(Icon, { name: 'check' })),
              React.createElement('h3', null, 'Todo al día'),
              React.createElement('p', null, 'Ningún lead necesita un toque ahora mismo. La cadencia avisa cuando toque el próximo paso.'))
          : React.createElement('table', { className: 'tbl' },
            React.createElement('thead', null, React.createElement('tr', null, ['Lead', 'Etapa', 'Próximo paso', 'Canal', 'Vence', ''].map((h, i) => React.createElement('th', { key: i }, h)))),
            React.createElement('tbody', null, cola.map((it, i) => {
              const s = BA.salidaById ? BA.salidaById(it.tripId) : null;
              const dl = dueLabel(it.dueAt);
              return React.createElement('tr', { key: it.leadId + '-' + it.step, className: 'click', onClick: () => openLead && openLead(it.leadId) },
                React.createElement('td', null, React.createElement('span', { className: 'nm' }, it.lead.replace(/^Sample\s·\s/, ''))),
                React.createElement('td', null, it.stageLabel, s && React.createElement('span', { style: { color: 'var(--text-faint)' } }, ' · ' + (s.region || s.titulo))),
                React.createElement('td', null, it.name || it.subject || ('Paso ' + it.step)),
                React.createElement('td', null, React.createElement(ChPill, { ch: it.channel })),
                React.createElement('td', null, React.createElement('span', { className: 'badge ' + dl.cls }, dl.t)),
                React.createElement('td', { style: { textAlign: 'right' } }, React.createElement('button', { className: 'btn sm', onClick: (ev) => preparar(it, ev) }, (CH[it.channel] || {}).act || 'Preparar')));
            }))
          )
      )
    );
  }

  window.Cadencias = Cadencias;
})();
