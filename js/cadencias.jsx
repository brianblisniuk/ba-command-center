/* B&A · Cadencias (pasos por etapa · canal · offset) → window.Cadencias */
(function () {
  const { Icon, StatCard, Avatar, CardHead } = window;
  const { useState } = React;
  const BA = window.BA;
  const CH = {
    mail:     { t: 'Mail',     c: 'var(--curso)', ic: 'mail',  act: 'Preparar mail' },
    whatsapp: { t: 'WhatsApp', c: '#1c8a52',      ic: 'chat',  act: 'Ver WhatsApp' },
    guion:    { t: 'Guion',    c: 'var(--brass)', ic: 'list',  act: 'Ver guion' },
  };
  const STAGES = ['Nuevos', 'Contactados', 'Propuesta', 'Negociación'];

  function ChPill({ ch }) {
    const m = CH[ch];
    return React.createElement('span', { className: 'ch-pill', style: { background: 'color-mix(in oklab,' + m.c + ' 15%, transparent)', color: m.c } },
      React.createElement(Icon, { name: m.ic }), m.t);
  }

  function Cadencias({ nav, toast, openLead }) {
    const reglas = BA.cadencias.reglas;
    const [sel, setSel] = useState({ stage: 'Negociación', step: 1 });
    const selRule = reglas.find(r => r.stage === sel.stage && r.step === sel.step) || reglas[0];
    const sampleLead = BA.leads.find(l => l.etapa === selRule.stage) || BA.leads[0];
    const rendered = BA.renderCadence(sampleLead, selRule.stage + '|' + selRule.step);
    const pend = BA.leads.filter(l => l.etapa !== 'Reservado').map(l => {
      const r = reglas.find(x => x.stage === l.etapa) || reglas[0];
      const vencido = l.dias > 10;
      return { l, r, vencido, due: vencido ? 'vencido' : l.dias === 0 ? 'hoy' : 'en ' + l.dias + 'd' };
    }).sort((a, b) => b.l.dias - a.l.dias);
    const hoy = pend.filter(p => p.l.dias <= 1).length;
    const venc = pend.filter(p => p.vencido).length;

    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' }, React.createElement('div', null,
        React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Cadencias')),
        React.createElement('div', { className: 'page-greet-sub' }, 'El próximo toque, automático · enganchado a Ventas y Bandeja'))),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--gap)' } },
        React.createElement(StatCard, { icon: 'send', iconCls: '', label: 'Cadencias activas', value: pend.length, sub: 'leads en seguimiento' }),
        React.createElement(StatCard, { icon: 'clock', iconCls: 'tint-brass', label: 'Toques hoy', value: hoy, sub: 'requieren acción' }),
        React.createElement(StatCard, { icon: 'alert', iconCls: 'tint-bad', label: 'Vencidos', value: venc, sub: '+10 días sin tocar' }),
        React.createElement(StatCard, { icon: 'layers', iconCls: 'tint', label: 'Reglas', value: reglas.length, sub: STAGES.length + ' etapas' })
      ),
      // reglas por etapa
      React.createElement('div', { className: 'eyebrow', style: { marginBottom: 12 } }, 'Reglas por etapa'),
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: 28 } },
        STAGES.map(st => React.createElement('div', { key: st, className: 'card pad' },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 } },
            React.createElement('h3', { style: { fontSize: 15 } }, st),
            React.createElement('span', { className: 'eyebrow' }, reglas.filter(r => r.stage === st).length + ' pasos')),
          reglas.filter(r => r.stage === st).map((r, i) => React.createElement('div', { key: i, onClick: () => setSel({ stage: r.stage, step: r.step }), style: { display: 'flex', gap: 11, padding: '10px 8px', margin: '0 -8px', borderRadius: 'var(--radius-xs)', cursor: 'pointer', borderTop: i ? '1px solid var(--rule-soft)' : 'none', background: (sel.stage === r.stage && sel.step === r.step) ? 'var(--surface-2)' : 'transparent' } },
            React.createElement('span', { style: { width: 24, height: 24, borderRadius: 8, flexShrink: 0, background: 'var(--surface-sunk)', color: 'var(--text-2)', display: 'grid', placeItems: 'center', fontFamily: 'var(--ff-mono)', fontSize: 11, fontWeight: 700 } }, r.step),
            React.createElement('div', { style: { flex: 1, minWidth: 0 } },
              React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-1)', fontWeight: 550 } }, r.subject),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 } },
                React.createElement(ChPill, { ch: r.channel }),
                React.createElement('span', { className: 'mono', style: { fontSize: 10.5, color: 'var(--text-3)' } }, r.offset === 0 ? 'día 0' : '+' + r.offset + ' días')))
          ))
        ))
      ),
      // preview del mensaje renderizado
      React.createElement('div', { className: 'card pad', style: { marginBottom: 28 } },
        React.createElement(CardHead, { title: 'Vista previa del mensaje', right: React.createElement('span', { className: 'eyebrow' }, 'cadence_render · variables resueltas') }),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' } },
          React.createElement('span', { className: 'badge ghost' }, selRule.stage + ' · paso ' + selRule.step),
          React.createElement(ChPill, { ch: selRule.channel }),
          React.createElement('span', { style: { fontSize: 12, color: 'var(--text-3)' } }, 'ejemplo con '),
          React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6 } }, React.createElement(Avatar, { id: sampleLead.resp, size: 22 }), React.createElement('b', { style: { fontSize: 12.5, color: 'var(--text-1)' } }, sampleLead.nombre))),
        selRule.channel !== 'guion' && React.createElement('div', { style: { fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--text-3)', marginBottom: 8 } }, 'Asunto: ', React.createElement('span', { style: { color: 'var(--text-1)' } }, selRule.subject)),
        React.createElement('div', { style: { background: 'var(--surface-2)', border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', padding: 16, fontSize: 13.5, lineHeight: 1.65, color: 'var(--text-1)', whiteSpace: 'pre-wrap' } }, rendered),
        React.createElement('div', { style: { display: 'flex', gap: 9, marginTop: 14, flexWrap: 'wrap' } },
          React.createElement('button', { className: 'btn primary', onClick: () => { nav('bandeja'); toast('Mensaje listo para ' + sampleLead.nombre.split(' ')[0]); } }, React.createElement(Icon, { name: 'send' }), 'Usar con ' + sampleLead.nombre.split(' ')[0]),
          React.createElement('button', { className: 'btn', onClick: () => { navigator.clipboard && navigator.clipboard.writeText(rendered); toast('Copiado'); } }, React.createElement(Icon, { name: 'copy' }), 'Copiar'),
          React.createElement('button', { className: 'btn', onClick: () => toast('Editar plantilla') }, React.createElement(Icon, { name: 'list' }), 'Editar plantilla'))
      ),
      // próximo toque
      React.createElement('div', { className: 'card pad' },
        React.createElement(CardHead, { title: 'Próximo toque', count: pend.length, right: React.createElement('button', { className: 'btn sm primary', onClick: () => { nav('bandeja'); toast('Borradores de cadencia listos en Bandeja'); } }, React.createElement(Icon, { name: 'spark' }), 'Preparar todos') }),
        pend.length === 0
          ? React.createElement('div', { className: 'stub' },
              React.createElement('div', { className: 'ic' }, React.createElement(Icon, { name: 'check' })),
              React.createElement('h3', null, 'Todo al día'),
              React.createElement('p', null, 'Ningún lead necesita un toque ahora mismo. La cadencia avisa cuando toque el próximo paso.'))
          : React.createElement('table', { className: 'tbl' },
          React.createElement('thead', null, React.createElement('tr', null, ['Lead', 'Etapa', 'Próximo paso', 'Canal', 'Vence', ''].map((h, i) => React.createElement('th', { key: i }, h)))),
          React.createElement('tbody', null, pend.map((p, i) => {
            const s = BA.salidaById(p.l.salida);
            return React.createElement('tr', { key: i, className: 'click', onClick: () => openLead && openLead(p.l.id) },
              React.createElement('td', null, React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 9 } }, React.createElement(Avatar, { id: p.l.resp, size: 26 }), React.createElement('span', { className: 'nm' }, p.l.nombre))),
              React.createElement('td', null, p.l.etapa, s && React.createElement('span', { style: { color: 'var(--text-faint)' } }, ' · ' + s.region)),
              React.createElement('td', null, p.r.subject),
              React.createElement('td', null, React.createElement(ChPill, { ch: p.r.channel })),
              React.createElement('td', null, React.createElement('span', { className: 'badge ' + (p.vencido ? 'bad' : p.l.dias <= 1 ? 'risk' : 'ghost') }, p.due)),
              React.createElement('td', { style: { textAlign: 'right' } }, React.createElement('button', { className: 'btn sm', onClick: (ev) => { ev.stopPropagation(); nav('bandeja'); toast(CH[p.r.channel].act + ' · ' + p.l.nombre); } }, CH[p.r.channel].act)));
          }))
        )
      )
    );
  }

  window.Cadencias = Cadencias;
})();
