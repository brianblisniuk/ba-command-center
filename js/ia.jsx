/* B&A · Inteligencia (vista IA integral) → window.IAIntegral */
(function () {
  const { useState } = React;
  const KIND_LBL = { copiloto: 'Copiloto', email_triage: 'Triage de mails', otro: 'Otro' };
  const KIND_COLOR = { copiloto: 'var(--accent)', email_triage: 'var(--brass)', otro: 'var(--stone)' };

  function money(n) { n = +n || 0; return 'US$ ' + (n < 1 ? n.toFixed(3) : n.toFixed(2)); }
  function relTime(iso) {
    if (!iso) return '';
    const d = new Date(iso), s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (s < 60) return 'recién';
    if (s < 3600) return 'hace ' + Math.floor(s / 60) + ' min';
    if (s < 86400) return 'hace ' + Math.floor(s / 3600) + ' h';
    return 'hace ' + Math.floor(s / 86400) + ' d';
  }
  function html(s) { return { __html: (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>') }; }

  function IAIntegral({ toast, nav, openTrip, openLead, openCompose }) {
    const [usage, setUsage] = useState(null);
    const [brief, setBrief] = useState(window.BA._iaBrief || null);
    const [gen, setGen] = useState(false);

    React.useEffect(() => {
      let on = true;
      Promise.resolve(BA.source.iaUsage()).then(u => { if (on) setUsage(u); });
      if (!window.BA._iaBrief) generar();
      return () => { on = false; };
    }, []);

    function generar() {
      setGen(true);
      Promise.resolve(BA.source.resumenEjecutivo()).then(r => {
        window.BA._iaBrief = r; setBrief(r); setGen(false);
        Promise.resolve(BA.source.iaUsage()).then(u => setUsage(u));
      });
    }
    function doAction(ac) {
      if (!ac) return;
      if (ac.tipo === 'navegar' && ac.ref) nav(ac.ref);
      else if (ac.tipo === 'viaje' && ac.ref) openTrip(ac.ref);
      else if (ac.tipo === 'lead' && ac.ref) { openLead ? openLead(ac.ref) : nav('ventas'); }
      else if (ac.tipo === 'finanzas') nav('finanzas');
      else if (ac.tipo === 'redactar') { openCompose ? openCompose({ to: ac.ref || '', account: 'reservas', subject: '', body: (brief && brief.respuesta) || '' }) : nav('bandeja'); }
      else nav('bandeja');
    }

    const t = (usage && usage.total) || {};
    const porTipo = (usage && usage.por_tipo) || [];
    const recientes = (usage && usage.recientes) || [];
    const maxCost = Math.max.apply(null, porTipo.map(x => +x.costo || 0).concat([0.0001]));

    return React.createElement('div', { className: 'content-inner' },
      React.createElement('div', { className: 'page-head' },
        React.createElement('div', null,
          React.createElement('h1', null, React.createElement('span', { className: 'lt' }, 'Inteligencia')),
          React.createElement('div', { className: 'page-greet-sub' }, 'Copiloto y triage sobre todo el negocio · ', React.createElement('b', null, 'Claude'))),
        React.createElement('div', { className: 'tag' }, React.createElement(Icon, { name: 'spark' }), 'IA · activa')),

      React.createElement('div', { className: 'card pad', style: { marginBottom: 'var(--gap)' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12, flexWrap: 'wrap' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 11 } },
            React.createElement('div', { className: 'copilot-orb', style: { width: 36, height: 36 } }, React.createElement(Icon, { name: 'spark' })),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 16, fontWeight: 650, color: 'var(--text-1)' } }, 'Resumen ejecutivo del día'),
              React.createElement('div', { style: { fontSize: 11.5, color: 'var(--text-3)' } }, 'Generado por Claude Sonnet sobre tus datos reales'))),
          React.createElement('button', { className: 'btn sm', disabled: gen, onClick: generar }, React.createElement(Icon, { name: 'refresh' }), gen ? 'Generando…' : 'Regenerar')),
        (gen && !brief)
          ? React.createElement('div', { className: 'copilot-answer' }, React.createElement('span', { className: 'typing' }, React.createElement('i'), React.createElement('i'), React.createElement('i')))
          : brief
            ? React.createElement('div', null,
                React.createElement('div', { style: { fontSize: 14, lineHeight: 1.65, color: 'var(--text-1)' }, dangerouslySetInnerHTML: html(brief.respuesta) }),
                brief.acciones && brief.acciones.length > 0 && React.createElement('div', { className: 'ans-chips', style: { marginTop: 16 } },
                  brief.acciones.map((ac, i) => React.createElement('button', { key: i, className: i ? 'ghost' : '', onClick: () => doAction(ac) }, ac.label))))
            : React.createElement('div', { style: { fontSize: 13, color: 'var(--text-3)' } }, 'Tocá Regenerar para pedirle el resumen del día.')),

      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 'var(--gap)' } },
        React.createElement(StatCard, { icon: 'coin', iconCls: '', label: 'Costo IA acumulado', value: money(t.costo), sub: (t.consultas || 0) + ' consultas' }),
        React.createElement(StatCard, { icon: 'spark', iconCls: 'tint', label: 'Tokens procesados', value: (((t.tokens_in || 0) + (t.tokens_out || 0)) / 1000).toFixed(1) + 'k', sub: (t.tokens_in || 0) + ' in · ' + (t.tokens_out || 0) + ' out' }),
        React.createElement(StatCard, { icon: 'check', iconCls: 'tint', label: 'Errores', value: (t.errores || 0), sub: t.errores ? 'revisar' : 'todo ok' })),

      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.3fr)', alignItems: 'start' } },
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Costo por función' }),
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 15, marginTop: 6 } },
            porTipo.length === 0
              ? React.createElement('div', { style: { fontSize: 13, color: 'var(--text-3)' } }, 'Sin uso todavía.')
              : porTipo.map((x, i) => React.createElement('div', { key: i },
                  React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 } },
                    React.createElement('span', { style: { fontWeight: 600, color: 'var(--text-1)' } }, KIND_LBL[x.kind] || x.kind),
                    React.createElement('span', { className: 'mono', style: { color: 'var(--text-1)' } }, money(x.costo))),
                  React.createElement('div', { style: { height: 7, borderRadius: 99, background: 'var(--surface-sunk)', overflow: 'hidden' } },
                    React.createElement('div', { style: { height: '100%', width: Math.round((+x.costo / maxCost) * 100) + '%', background: KIND_COLOR[x.kind] || 'var(--accent)' } })),
                  React.createElement('div', { style: { fontSize: 11, color: 'var(--text-3)', marginTop: 4 } }, x.consultas + ' consultas · ' + (x.tokens || 0) + ' tokens')))) ),
        React.createElement('div', { className: 'card pad' },
          React.createElement(CardHead, { title: 'Actividad reciente' }),
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column' } },
            recientes.length === 0
              ? React.createElement('div', { style: { fontSize: 13, color: 'var(--text-3)' } }, 'Sin actividad.')
              : recientes.map((r, i) => React.createElement('div', { key: i, className: 'row', style: { paddingTop: i ? 11 : 4, alignItems: 'flex-start', gap: 11 } },
                  React.createElement('div', { className: 'q-ic ' + (r.kind === 'copiloto' ? 'go' : 'risk'), style: { width: 30, height: 30, borderRadius: 9, flexShrink: 0 } }, React.createElement(Icon, { name: r.kind === 'copiloto' ? 'spark' : 'mail' })),
                  React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                    React.createElement('div', { style: { fontSize: 12.5, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, r.resumen || (KIND_LBL[r.kind] || r.kind)),
                    React.createElement('div', { style: { fontSize: 11, color: 'var(--text-3)' } }, (KIND_LBL[r.kind] || r.kind) + ' · ' + relTime(r.cuando))),
                  React.createElement('span', { className: 'mono', style: { fontSize: 11, color: 'var(--text-3)', flexShrink: 0 } }, money(r.costo)))))))
    );
  }
  window.IAIntegral = IAIntegral;
})();
